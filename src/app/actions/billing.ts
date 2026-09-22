'use server';

import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function createCheckoutSession() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create a new customer in Stripe if not exists
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Update the profile with the new customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Determine the base URL for redirection
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID, // Ensure you have this in .env
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/dashboard/settings/billing?upgrade=cancelled`,
      metadata: {
        supabase_user_id: user.id,
      },
    });

    if (!session.url) {
      return { success: false, error: 'Failed to create Stripe session URL' };
    }

    return { success: true, url: session.url };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { success: false, error: error.message || 'Failed to create checkout session' };
  }
}
