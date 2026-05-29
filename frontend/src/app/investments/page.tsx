'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { investmentApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  TrendingUp, Calendar, Shield, Loader2, Wallet, DollarSign, Clock,
  CheckCircle2, Minus, X, IndianRupee, Info, Sparkles, Building2, Layers
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-amber-500/5 border-amber-500/20', text: 'text-amber-400 bg-amber-500/15', dot: 'bg-amber-400' },
  ACTIVE: { bg: 'bg-emerald-500/5 border-emerald-500/20', text: 'text-emerald-400 bg-emerald-500/15', dot: 'bg-emerald-400' },
  COMPLETED: { bg: 'bg-blue-500/5 border-blue-500/20', text: 'text-blue-400 bg-blue-500/15', dot: 'bg-blue-400' },
  CANCELLED: { bg: 'bg-slate-500/5 border-slate-500/20', text: 'text-slate-400 bg-slate-500/15', dot: 'bg-slate-400' },
};

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'investments' | 'payouts'>('investments');
  const [showWithdraw, setShowWithdraw] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const [invRes, statsRes, payRes] = await Promise.all([
          investmentApi.getMine(), investmentApi.getPortfolio(),
          fetch(`${API_URL}/payouts/my`, { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
        ]);
        setInvestments(invRes.data.data || invRes.data || []);
        setStats(statsRes.data.data || statsRes.data);
        setPayouts(payRes.data || payRes || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleWithdraw = async (investmentId: string) => {
    if (!withdrawAmount || Number(withdrawAmount) < 100) { toast.error('Minimum ₹100'); return; }
    setWithdrawing(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/investments/${investmentId}/withdraw`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(withdrawAmount) }),
      });
      const data = await res.json();
      if (data.success || data.data?.success) {
        toast.success(data.data?.message || 'Withdrawn!');
        setShowWithdraw(null); setWithdrawAmount('');
        const [invRes, statsRes] = await Promise.all([investmentApi.getMine(), investmentApi.getPortfolio()]);
        setInvestments(invRes.data.data || invRes.data || []);
        setStats(statsRes.data.data || statsRes.data);
      } else throw new Error(data.message || 'Failed');
    } catch (err: any) { toast.error(err.message || 'Withdrawal failed'); }
    setWithdrawing(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-white/5 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="glass-card p-4 h-20"/>)}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={28} className="text-brand-400" /> My Investments
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track portfolio, returns & monthly payouts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Wallet, label: 'Total Invested', value: formatCurrency(stats?.totalInvested || 0), color: 'text-brand-400', bg: 'from-brand-500/10 to-brand-600/5' },
            { icon: Sparkles, label: 'Active', value: stats?.active || 0, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-600/5' },
            { icon: Clock, label: 'Pending', value: stats?.pending || 0, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-600/5' },
            { icon: CheckCircle2, label: 'Completed', value: stats?.completed || 0, color: 'text-violet-400', bg: 'from-violet-500/10 to-violet-600/5' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className={`glass-card p-4 bg-gradient-to-br ${s.bg}`}>
              <s.icon size={20} className={`${s.color} mb-2`} />
              <p className="text-xl font-display font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/8 pb-3">
          {[
            { id: 'investments' as const, label: 'Investments', count: investments.length },
            { id: 'payouts' as const, label: 'Payouts', count: payouts.length },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-brand-600/20 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-brand-500/30 text-brand-300' : 'bg-white/5 text-slate-500'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <div className="space-y-4">
            {investments.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] flex items-center justify-center mx-auto mb-4">
                  <Building2 size={36} className="text-slate-600" />
                </div>
                <p className="text-white font-semibold text-lg">No investments yet</p>
                <p className="text-slate-400 text-sm mt-1">Start by browsing verified businesses</p>
                <a href="/businesses" className="btn-primary inline-flex mt-4 px-6 py-2.5 text-sm">Browse Businesses</a>
              </motion.div>
            ) : (
              investments.map((inv, i) => {
                const monthlyPrincipal = inv.business?.tenureMonths ? Number(inv.amount) / inv.business.tenureMonths : 0;
                const monthlyReturn = Number(inv.amount) * ((inv.business?.returnRate || 0) / 100);
                const monthlyPayout = monthlyPrincipal + monthlyReturn;
                const canWithdraw = (inv.status === 'ACTIVE' || inv.status === 'PENDING') && Number(inv.amount) > 0;
                const statusStyle = STATUS_COLORS[inv.status] || STATUS_COLORS.PENDING;

                return (
                  <motion.div key={inv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className={`glass-card p-5 sm:p-6 border ${statusStyle.bg} ${inv.status === 'CANCELLED' ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Business Name + Status */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot}`} />
                          <p className="font-display font-bold text-white text-lg">{inv.business?.name || 'Business'}</p>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${statusStyle.text}`}>
                            {inv.status}
                          </span>
                        </div>

                        {/* Investment Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase">Invested</p>
                            <p className="text-white font-bold font-mono">{formatCurrency(inv.amount)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase">Return Rate</p>
                            <p className="text-emerald-400 font-bold">{inv.business?.returnRate || 0}%</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase">Tenure</p>
                            <p className="text-white font-bold">{inv.business?.tenureMonths || 0} months</p>
                          </div>
                        </div>

                        {/* Monthly Calculation */}
                        {Number(inv.amount) > 0 && inv.business?.returnRate && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-brand-500/5 to-emerald-500/5 border border-brand-500/10">
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Monthly Payout</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-brand-400 font-bold font-mono">{formatCurrency(monthlyPrincipal)}</span>
                              <span className="text-[10px] text-slate-500">principal</span>
                              <span className="text-slate-500">+</span>
                              <span className="text-sm text-emerald-400 font-bold font-mono">{formatCurrency(monthlyReturn)}</span>
                              <span className="text-[10px] text-slate-500">return</span>
                              <span className="text-slate-500">=</span>
                              <span className="text-lg text-white font-extrabold font-mono">{formatCurrency(monthlyPayout)}/mo</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Withdraw Button */}
                      {canWithdraw && (
                        <button onClick={() => { setShowWithdraw(inv.id); setWithdrawAmount(inv.amount.toString()); }}
                          className="px-4 py-2.5 rounded-xl bg-rose-500/15 text-rose-400 text-sm font-bold hover:bg-rose-500/25 transition-all flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                          <Minus size={16} /> Withdraw
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="space-y-3">
            {payouts.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 text-center">
                <DollarSign size={48} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No payouts yet</p>
                <p className="text-xs text-slate-500 mt-1">Monthly returns will appear here</p>
              </motion.div>
            ) : (
              payouts.map((payout, i) => (
                <motion.div key={payout.id || i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <DollarSign size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{payout.investment?.business?.name || 'Business'}</p>
                      <p className="text-xs text-slate-500">{payout.notes || 'Monthly Payout'}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{new Date(payout.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-extrabold text-emerald-400 font-mono">+{formatCurrency(payout.amount)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      payout.status === 'PROCESSED' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                    }`}>{payout.status}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowWithdraw(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()} className="relative w-full max-w-sm glass-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-white">Withdraw Investment</h3>
                <button onClick={() => setShowWithdraw(null)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-5">
                <Info size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">Full withdrawal will cancel this investment. Funds will be returned to your wallet.</p>
              </div>
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount (₹)</label>
                <div className="relative">
                  <IndianRupee size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                    className="input-field pl-14 py-4 text-2xl font-extrabold text-center" autoFocus />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: 'All', pct: 1 }, { label: '50%', pct: 0.5 }, { label: '25%', pct: 0.25 },
                ].map(opt => {
                  const inv = investments.find(i => i.id === showWithdraw);
                  const amt = Math.round(Number(inv?.amount || 0) * opt.pct);
                  return (
                    <button key={opt.label} onClick={() => setWithdrawAmount(amt.toString())}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        Number(withdrawAmount) === amt ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'glass-card text-slate-400 hover:text-white'
                      }`}>{opt.label} ₹{amt.toLocaleString('en-IN')}</button>
                  );
                })}
              </div>
              <button onClick={() => handleWithdraw(showWithdraw)} disabled={withdrawing || !withdrawAmount || Number(withdrawAmount) < 100}
                className="w-full py-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-500/30 disabled:opacity-40 transition-all">
                {withdrawing ? <Loader2 size={18} className="animate-spin" /> : <Minus size={18} />} Confirm Withdrawal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
