'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { walletApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, Shield, Loader2, Plus, Minus,
  CheckCircle2, XCircle, Clock, IndianRupee, X, RefreshCw, Sparkles,
  TrendingUp, History, CreditCard, ArrowRight, Copy, WalletCards, Info
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const TX_TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  DEPOSIT: { icon: ArrowDownLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Deposit' },
  WITHDRAWAL: { icon: ArrowUpRight, color: 'text-rose-400', bg: 'bg-rose-500/10', label: 'Withdrawal' },
  INVESTMENT: { icon: TrendingUp, color: 'text-brand-400', bg: 'bg-brand-500/10', label: 'Investment' },
  ESCROW_LOCK: { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Escrow' },
  ESCROW_RELEASE: { icon: ArrowDownLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Released' },
  RETURN: { icon: Sparkles, color: 'text-violet-400', bg: 'bg-violet-500/10', label: 'Return' },
  REFUND: { icon: ArrowDownLeft, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Refund' },
};

const FILTERS = ['ALL', 'DEPOSIT', 'WITHDRAWAL', 'INVESTMENT', 'RETURN', 'REFUND'];

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const loadWallet = async () => {
    try {
      const [wRes, txRes] = await Promise.all([walletApi.get(), walletApi.getTransactions({ limit: 100 })]);
      setWallet(wRes.data.data);
      setTxs(txRes.data.data?.data || []);
    } catch { toast.error('Failed to load wallet data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadWallet(); }, []);

  const handleDeposit = async () => {
    if (!amount || Number(amount) < 100) { toast.error('Minimum ₹100'); return; }
    setProcessing(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();
      if (data.success || data.data?.success) {
        setDepositSuccess(true);
        toast.success(`₹${Number(amount).toLocaleString('en-IN')} added! 🎉`);
        setTimeout(() => { setShowDeposit(false); setDepositSuccess(false); loadWallet(); }, 1500);
      } else throw new Error(data.message || 'Failed');
    } catch (err: any) { toast.error(err.message || 'Deposit failed'); }
    setProcessing(false);
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) < 100) { toast.error('Minimum ₹100'); return; }
    if (Number(amount) > (wallet?.balance || 0)) { toast.error('Insufficient balance'); return; }
    setProcessing(true);
    try {
      await walletApi.withdraw(Number(amount));
      toast.success(`₹${Number(amount).toLocaleString('en-IN')} withdrawal initiated`);
      setAmount(''); setShowWithdraw(false); loadWallet();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed'); }
    setProcessing(false);
  };

  const filteredTxs = filter === 'ALL' ? txs : txs.filter(tx => tx.type === filter);

  // Quick stats
  const totalDeposited = txs.filter(t => t.type === 'DEPOSIT' && t.status === 'COMPLETED').reduce((s, t) => s + Number(t.amount), 0);
  const totalWithdrawn = txs.filter(t => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED').reduce((s, t) => s + Number(t.amount), 0);
  const totalReturns = txs.filter(t => t.type === 'RETURN').reduce((s, t) => s + Number(t.amount), 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-white/5 rounded w-32" />
          <div className="h-40 bg-white/5 rounded-2xl" />
          <div className="grid grid-cols-3 gap-4"><div className="h-24 bg-white/5 rounded-xl" /><div className="h-24 bg-white/5 rounded-xl" /><div className="h-24 bg-white/5 rounded-xl" /></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <WalletCards size={28} className="text-brand-400" /> Wallet
            </h1>
            <p className="text-slate-400 text-sm mt-1">Instant deposits • 0% fee • Auto-credited</p>
          </div>
          <button onClick={loadWallet} className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-white hover:border-brand-500/30 transition-all" title="Refresh">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Balance Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 bg-gradient-to-br from-brand-600/10 via-brand-800/5 to-emerald-600/10 border-brand-500/20 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px]" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-[60px]" />
          
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">Available Balance</p>
                <p className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {formatCurrency(wallet?.balance || 0)}
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeposit(true)}
                  className="btn-primary px-6 py-3 text-sm font-bold flex items-center gap-2 shadow-brand">
                  <Plus size={18} /> Deposit
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowWithdraw(true)}
                  className="glass-card px-6 py-3 text-sm font-bold flex items-center gap-2 text-white hover:border-rose-500/30 hover:text-rose-400 transition-all">
                  <Minus size={18} /> Withdraw
                </motion.button>
              </div>
            </div>

            {/* Mini Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/8">
              {[
                { label: 'Total Deposited', value: formatCurrency(totalDeposited), color: 'text-emerald-400', icon: ArrowDownLeft },
                { label: 'Total Withdrawn', value: formatCurrency(totalWithdrawn), color: 'text-rose-400', icon: ArrowUpRight },
                { label: 'Total Returns', value: formatCurrency(totalReturns), color: 'text-violet-400', icon: Sparkles },
              ].map((s, i) => (
                <div key={s.label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <s.icon size={14} className={s.color} />
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <History size={20} className="text-brand-400" /> Transaction History
            </h2>
            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    filter === f ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}>
                  {f === 'ALL' ? 'All' : TX_TYPE_CONFIG[f]?.label || f}
                </button>
              ))}
            </div>
          </div>

          {filteredTxs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] flex items-center justify-center mx-auto mb-4">
                <History size={32} className="text-slate-600" />
              </div>
              <p className="text-white font-semibold">No transactions yet</p>
              <p className="text-xs text-slate-500 mt-1">Your financial activity will appear here</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[500px] overflow-y-auto scrollbar-thin">
              {filteredTxs.map((tx: any, i: number) => {
                const config = TX_TYPE_CONFIG[tx.type] || TX_TYPE_CONFIG.DEPOSIT;
                const Icon = config.icon;
                const isCredit = ['DEPOSIT', 'ESCROW_RELEASE', 'RETURN', 'REFUND'].includes(tx.type);
                return (
                  <motion.div key={tx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-4 py-3.5 px-4 rounded-xl hover:bg-white/[0.02] transition-all group">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} className={config.color} />
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 font-semibold">{config.label}</p>
                      {tx.description && tx.description !== config.label && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{tx.description}</p>
                      )}
                    </div>
                    {/* Date (hidden on mobile) */}
                    <p className="hidden sm:block text-xs text-slate-500 flex-shrink-0">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-extrabold font-mono ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      {tx.status && tx.status !== 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold mt-0.5">
                          <Clock size={10} /> {tx.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDeposit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeposit(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()} className="relative w-full max-w-sm glass-card p-6 shadow-2xl">
              {depositSuccess ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 size={44} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Deposit Successful!</h3>
                  <p className="text-emerald-400 font-extrabold text-2xl mt-1">₹{Number(amount || 0).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-slate-400 mt-2">Added to your wallet instantly</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-white">Deposit Funds</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Instant • 0% Fee</p>
                    </div>
                    <button onClick={() => setShowDeposit(false)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"><X size={18} /></button>
                  </div>

                  <div className="space-y-2 mb-5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</label>
                    <div className="relative">
                      <IndianRupee size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                        placeholder="1,000" className="input-field pl-14 py-4 text-2xl font-extrabold text-center tracking-tight" autoFocus />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {[1000, 5000, 10000, 25000, 50000, 100000].map(a => (
                      <button key={a} onClick={() => setAmount(a.toString())}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                          Number(amount) === a
                            ? 'bg-brand-500 text-white shadow-brand scale-105'
                            : 'glass-card text-slate-400 hover:text-white hover:border-white/20'
                        }`}>
                        ₹{a >= 1000 ? (a/1000).toFixed(0) + 'K' : a}
                      </button>
                    ))}
                  </div>

                  <button onClick={handleDeposit} disabled={processing || !amount || Number(amount) < 100}
                    className="btn-primary w-full justify-center py-4 text-base font-bold flex items-center gap-2 shadow-brand disabled:opacity-40 disabled:cursor-not-allowed">
                    {processing ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                    {processing ? 'Processing...' : `Deposit ₹${amount ? Number(amount).toLocaleString('en-IN') : '0'}`}
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowWithdraw(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()} className="relative w-full max-w-sm glass-card p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Withdraw Funds</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Available: {formatCurrency(wallet?.balance || 0)}</p>
                </div>
                <button onClick={() => setShowWithdraw(false)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"><X size={18} /></button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-5">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-amber-400" />
                  <span className="text-sm text-slate-300">Available Balance</span>
                </div>
                <span className="text-lg font-extrabold text-white">{formatCurrency(wallet?.balance || 0)}</span>
              </div>

              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</label>
                <div className="relative">
                  <IndianRupee size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-400" />
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="1,000" className="input-field pl-14 py-4 text-2xl font-extrabold text-center tracking-tight" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[1000, 5000, 10000, 25000, 50000].map(a => (
                  <button key={a} onClick={() => setAmount(a.toString())}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      Number(amount) === a
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'glass-card text-slate-400 hover:text-white'
                    }`}>
                    ₹{(a/1000).toFixed(0)}K
                  </button>
                ))}
              </div>

              <button onClick={handleWithdraw}
                disabled={processing || !amount || Number(amount) < 100 || Number(amount) > (wallet?.balance || 0)}
                className="w-full py-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-base font-bold flex items-center justify-center gap-2 hover:bg-rose-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {processing ? <Loader2 size={20} className="animate-spin" /> : <ArrowUpRight size={20} />}
                {processing ? 'Processing...' : `Withdraw ₹${amount ? Number(amount).toLocaleString('en-IN') : '0'}`}
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-3">Withdrawal processed within 24-48 hours</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
