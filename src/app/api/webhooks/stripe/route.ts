import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.supabase_user_id || session.client_reference_id;
        
        if (!userId) {
          console.error('No user ID found in session metadata');
          break;
        }

        const customerId = session.customer;
        const subscriptionId = session.subscription;

        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: 'PRO',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.error('Error updating profile:', error);
          break;
        }

        // Add notification
        await supabaseAdmin.from('notifications').insert({
          user_id: userId,
          title: 'Подписка активирована',
          message: 'Ваш тариф успешно повышен до NEXUS PRO!',
          type: 'system',
          is_read: false
        });

        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;
        const status = subscription.status;

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) break;

        if (status === 'active' || status === 'trialing') {
          await supabaseAdmin
            .from('profiles')
            .update({ subscription_tier: 'PRO' })
            .eq('stripe_customer_id', customerId);
        } else if (['past_due', 'unpaid', 'incomplete_expired'].includes(status)) {
          await supabaseAdmin
            .from('profiles')
            .update({ subscription_tier: 'FREE' }) // Downgrade or lock PRO features
            .eq('stripe_customer_id', customerId);

          await supabaseAdmin.from('notifications').insert({
            user_id: profile.id,
            title: 'Проблема с оплатой',
            message: 'Произошла ошибка при оплате подписки. Пожалуйста, обновите данные карты, чтобы не потерять доступ к PRO.',
            type: 'billing',
            is_read: false
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) break;

        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: 'FREE',
            stripe_subscription_id: null
          })
          .eq('stripe_customer_id', customerId);

        await supabaseAdmin.from('notifications').insert({
          user_id: profile.id,
          title: 'Подписка завершена',
          message: 'Ваша PRO подписка завершена. Вы переведены на тариф FREE',
          type: 'billing',
          is_read: false
        });

        break;
      }

      default:
        // Unhandled event type
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
