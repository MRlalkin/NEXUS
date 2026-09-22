import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CreditCard, Check, Zap, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Billing | NEXUS',
};

export default async function BillingSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const isPro = profile?.subscription_tier === 'PRO';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          Billing & Subscription
        </h2>
        <p className="text-sm text-slate-400">Manage your subscription plan and payment methods.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Plan</h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-white">{isPro ? 'PRO' : 'FREE'}</span>
              {isPro && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
            </div>
          </div>
          
          {isPro ? (
            <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl text-sm font-medium transition-colors border border-white/[0.05]">
              Manage in Stripe <ExternalLink className="w-4 h-4" />
            </button>
          ) : (
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25">
              <Zap className="w-4 h-4" />
              Upgrade to PRO
            </button>
          )}
        </div>

        <div className="space-y-4 pt-6 border-t border-white/[0.05]">
          <h4 className="text-sm font-bold text-white mb-4">Plan Limits</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-slate-300">Projects</span>
                <span className="text-slate-400 font-mono">{isPro ? 'Unlimited' : '2 / 2'}</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isPro ? 'bg-indigo-500 w-1/4' : 'bg-rose-500 w-full'}`} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-slate-300">Team Members</span>
                <span className="text-slate-400 font-mono">{isPro ? 'Unlimited' : 'Up to 5 per project'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
