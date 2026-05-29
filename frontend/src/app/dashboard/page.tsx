'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/auth.store';
import { walletApi, investmentApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  TrendingUp, Wallet, Building2, Shield, ArrowUpRight,
  Sparkles, PieChart, Target, BrainCircuit,
  Clock, BarChart3, Loader2, ChevronRight,
  ArrowDownLeft, ArrowUpRight as ArrowUp, Layers
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>({ wallet: null, portfolio: null, recentTx: [], loading: true });
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) { router.replace('/admin'); return; }
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    const load = async () => {
      try {
        const [wRes, pRes] = await Promise.all([walletApi.get(), investmentApi.getPortfolio()]);
        setData({ wallet: wRes.data.data || wRes.data, portfolio: pRes.data.data || pRes.data, recentTx: wRes.data.data?.transactions?.slice(0, 5) || [], loading: false });
      } catch { setData(prev => ({ ...prev, loading: false })); }
    };
    load();
  }, [user, router]);

  if (data.loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-white/5 rounded w-48" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i=><div key={i} className="glass-card p-5 h-28" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const portfolioValue = Number(data.portfolio?.totalInvested || 0);

  const txIcons: Record<string, any> = {
    DEPOSIT: <ArrowDownLeft size={16} className="text-emerald-400" />,
    WITHDRAWAL: <ArrowUp size={16} className="text-rose-400" />,
    INVESTMENT: <ArrowUp size={16} className="text-brand-400" />,
    RETURN: <ArrowDownLeft size={16} className="text-emerald-400" />,
    ESCROW_LOCK: <Shield size={16} className="text-amber-400" />,
    ESCROW_RELEASE: <ArrowDownLeft size={16} className="text-emerald-400" />,
    REFUND: <ArrowDownLeft size={16} className="text-cyan-400" />,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {greeting}, {user?.firstName || 'Investor'} <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Here&apos;s your financial overview</p>
          </div>
          <Link href="/businesses" className="btn-primary px-5 py-2.5 text-sm font-semibold shadow-brand hover:shadow-glow">
            <Sparkles size={16} /> Explore Businesses
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Wallet, label: 'Available Balance', value: formatCurrency(data.wallet?.balance || 0), trend: 'Ready to invest', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20', iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400' },
            { icon: Shield, label: 'In Escrow', value: formatCurrency(data.wallet?.escrowBalance || 0), trend: 'Locked', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/20', iconBg: 'bg-amber-500/20', iconColor: 'text-amber-400' },
            { icon: TrendingUp, label: 'Portfolio Value', value: formatCurrency(portfolioValue), trend: `${data.portfolio?.active || 0} active investments`, color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20', iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
            { icon: Target, label: 'Pending', value: formatCurrency(data.portfolio?.pending || 0), trend: 'Awaiting approval', color: 'from-violet-500/20 to-violet-600/10 border-violet-500/20', iconBg: 'bg-violet-500/20', iconColor: 'text-violet-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`glass-card p-5 bg-gradient-to-br ${s.color} cursor-default`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                  <s.icon size={20} className={s.iconColor} />
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{s.trend}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-white flex items-center gap-2">
                <Clock size={20} className="text-brand-400" /> Recent Activity
              </h2>
              <Link href="/wallet" className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 transition-colors">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>
            {data.recentTx.length === 0 ? (
              <div className="text-center py-16">
                <Layers className="w-14 h-14 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-medium">No transactions yet</p>
                <p className="text-xs text-slate-600 mt-1">Your activity will appear here</p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.recentTx.map((tx: any, i: number) => (
                  <motion.div key={tx.id || i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.04 }}
                    className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-white/[0.03] transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                      {txIcons[tx.type] || <Layers size={16} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 font-medium truncate">{tx.description || tx.type}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold font-mono ${['DEPOSIT','ESCROW_RELEASE','RETURN','REFUND'].includes(tx.type) ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {['DEPOSIT','ESCROW_RELEASE','RETURN','REFUND'].includes(tx.type) ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-card p-5 sm:p-6">
            <h2 className="font-display font-semibold text-white flex items-center gap-2 mb-5">
              <BrainCircuit size={20} className="text-purple-400" /> Quick Actions
            </h2>
            <div className="space-y-1.5">
              {[
                { icon: Building2, label: 'Browse Businesses', desc: 'Find verified deals', href: '/businesses', color: 'text-brand-400', bg: 'bg-brand-500/10' },
                { icon: Wallet, label: 'Manage Wallet', desc: 'Deposit or withdraw', href: '/wallet', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { icon: PieChart, label: 'My Portfolio', desc: 'Track investments', href: '/investments', color: 'text-violet-400', bg: 'bg-violet-500/10' },
                { icon: BarChart3, label: 'Analytics', desc: 'View performance', href: '/dashboard/analytics', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((item, i) => (
                <Link key={i} href={item.href}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-all group">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon size={20} className={item.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">{item.label}</p>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
