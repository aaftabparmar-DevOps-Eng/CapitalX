'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { businessApi, investmentApi, walletApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Building2, TrendingUp, Shield, MapPin, Calendar, Users,
  Globe, ArrowLeft, CheckCircle2, AlertTriangle, Zap,
  Loader2, X, Wallet, IndianRupee, Calculator, Target,
  BrainCircuit, Info, BarChart3, Clock, Star
} from 'lucide-react';

function RiskBadge({ level }: { level?: string }) {
  const config: Record<string, { icon: any; color: string; label: string }> = {
    LOW: { icon: CheckCircle2, color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'Low Risk' },
    MEDIUM: { icon: AlertTriangle, color: 'bg-amber-500/15 text-amber-400 border-amber-500/30', label: 'Medium Risk' },
    HIGH: { icon: AlertTriangle, color: 'bg-rose-500/15 text-rose-400 border-rose-500/30', label: 'High Risk' },
    VERY_HIGH: { icon: AlertTriangle, color: 'bg-red-900/30 text-red-400 border-red-500/30', label: 'Very High' },
  };
  if (!level || !config[level]) return null;
  const { icon: Icon, color, label } = config[level];
  return <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-semibold ${color}`}><Icon size={12} />{label}</span>;
}

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInvest, setShowInvest] = useState(false);
  const [amount, setAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [wallet, setWallet] = useState<any>(null);
  const [checked, setChecked] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const id = params.id as string;

  useEffect(() => { const t = setTimeout(() => setChecked(true), 500); return () => clearTimeout(t); }, []);
  useEffect(() => { if (checked && !isAuthenticated) router.push('/login?redirect=' + encodeURIComponent('/businesses/' + id)); }, [checked, isAuthenticated]);
  useEffect(() => {
    if (!isAuthenticated || !id) return;
    (async () => {
      try {
        const [bRes, wRes] = await Promise.all([businessApi.getOne(id), walletApi.get().catch(() => ({ data: { data: { balance: 0 } } }))]);
        setBusiness(bRes.data.data || bRes.data); setWallet(wRes.data.data);
      } catch { toast.error('Failed to load business'); }
      finally { setLoading(false); }
    })();
  }, [id, isAuthenticated]);

  const handleRefreshAI = async () => {
    setAiLoading(true);
    try {
      await fetch(`http://localhost:3001/api/v1/ai-risk/score/${id}`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
      toast.success('AI Score refreshed!');
      const bRes = await businessApi.getOne(id); setBusiness(bRes.data.data || bRes.data);
    } catch { toast.error('AI refresh failed'); }
    finally { setAiLoading(false); }
  };

  const handleInvest = async () => {
    if (!amount || Number(amount) < 1000) { toast.error('Minimum ₹1,000'); return; }
    if (Number(amount) > (wallet?.balance || 0)) { toast.error('Insufficient balance'); return; }
    setInvesting(true);
    try {
      await investmentApi.create({ businessId: id, amount: Number(amount) });
      toast.success(`Invested ₹${Number(amount).toLocaleString()}!`);
      setShowInvest(false); setAmount('');
      const [wRes, bRes] = await Promise.all([walletApi.get(), businessApi.getOne(id)]);
      setWallet(wRes.data.data); setBusiness(bRes.data.data || bRes.data);
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed'); }
    finally { setInvesting(false); }
  };

  if (!checked || !isAuthenticated || loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-400" /></div>;
  if (!business) return <DashboardLayout><div className="text-center py-20"><Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" /><h2 className="text-xl font-bold text-white">Business not found</h2><Link href="/businesses" className="text-brand-400 mt-4 inline-block">← Browse businesses</Link></div></DashboardLayout>;

  const pct = Math.min((Number(business.raisedAmount) / Number(business.targetAmount)) * 100, 100);
  const quickAmounts = [1000, 5000, 10000, 25000, 50000];
  const monthlyReturn = amount ? (Number(amount) * (business.returnRate || 0) / 100).toFixed(0) : '0';
  const annualReturn = amount ? (Number(amount) * (business.returnRate || 0) / 100 * 12).toFixed(0) : '0';

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Link href="/businesses" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Businesses
          </Link>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Clock size={14} /> Listed recently</span>
            <span className="flex items-center gap-1"><Users size={14} /> {business._count?.investments || 0} investors</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Business Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs bg-brand-500/15 text-brand-400 px-3 py-1 rounded-full font-semibold">{business.industry}</span>
                <RiskBadge level={business.riskScore?.riskLevel} />
                {business.status === 'VERIFIED' && (
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full font-semibold flex items-center gap-1"><CheckCircle2 size={12} />Verified</span>
                )}
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3">{business.name}</h1>
              <p className="text-slate-400 leading-relaxed text-sm">{business.description}</p>
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/8">
                {[
                  { icon: MapPin, label: 'Location', value: business.location || 'N/A' },
                  { icon: Calendar, label: 'Founded', value: business.foundedYear || 'N/A' },
                  { icon: Users, label: 'Team Size', value: business.teamSize ? `${business.teamSize} employees` : 'N/A' },
                  { icon: Globe, label: 'Website', value: business.website ? <a href={business.website} target="_blank" className="text-brand-400 hover:underline truncate block">{business.website}</a> : 'N/A' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <item.icon size={18} className="text-brand-400 mx-auto mb-1.5" />
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-white font-medium mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Target, label: 'Funding Goal', value: formatCurrency(business.targetAmount), color: 'text-brand-400' },
                { icon: TrendingUp, label: 'Return Rate', value: `${business.returnRate}% monthly`, color: 'text-emerald-400' },
                { icon: Calendar, label: 'Tenure', value: `${business.tenureMonths} months`, color: 'text-amber-400' },
                { icon: BarChart3, label: 'Progress', value: `${pct.toFixed(0)}% funded`, color: 'text-violet-400' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                  className="glass-card p-4 text-center">
                  <s.icon size={22} className={`${s.color} mx-auto mb-2`} />
                  <p className="text-sm font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Invest Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <div className="glass-card p-6 sticky top-24">
              {/* Trust Score */}
              <div className="text-center pb-5 border-b border-white/8 mb-5">
                <div className="inline-flex items-center gap-2 bg-brand-500/10 rounded-full px-5 py-2 mb-2">
                  <Shield size={16} className="text-brand-400" />
                  <span className="text-3xl font-extrabold text-white">{business.riskScore?.overallScore || 75}</span>
                  <span className="text-base text-slate-400">/100</span>
                </div>
                <p className="text-xs text-slate-500">AI Trust Score</p>
                <button onClick={handleRefreshAI} disabled={aiLoading}
                  className="mt-2 text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 mx-auto transition-colors">
                  {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                  {aiLoading ? 'Analyzing...' : 'Refresh Score'}
                </button>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Return Rate', value: `${business.returnRate}% monthly`, icon: TrendingUp, color: 'text-emerald-400' },
                  { label: 'Tenure', value: `${business.tenureMonths} months`, icon: Calendar, color: 'text-amber-400' },
                  { label: 'Min Investment', value: formatCurrency(business.minInvestment), icon: IndianRupee, color: 'text-brand-400' },
                  { label: 'Target Amount', value: formatCurrency(business.targetAmount), icon: Target, color: 'text-violet-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-slate-400 flex items-center gap-2"><item.icon size={14} className={item.color} />{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">{formatCurrency(business.raisedAmount)} raised</span>
                  <span className="text-white font-bold">{pct.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                    className={`h-full rounded-full bg-gradient-to-r ${pct >= 80 ? 'from-emerald-500 to-emerald-400' : pct >= 50 ? 'from-brand-500 to-brand-400' : 'from-amber-500 to-amber-400'}`} />
                </div>
              </div>

              {/* Invest Button */}
              <button onClick={() => setShowInvest(true)}
                className="btn-primary w-full justify-center py-3.5 mt-5 text-sm flex items-center gap-2 font-bold tracking-wide">
                <Zap size={18} /> Invest Now
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">₹1,000 minimum • Escrow protected</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Invest Modal */}
      <AnimatePresence>
        {showInvest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowInvest(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()} className="relative w-full max-w-md glass-card p-6 shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">Confirm Investment</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{business.name}</p>
                </div>
                <button onClick={() => setShowInvest(false)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"><X size={18} /></button>
              </div>

              {/* Wallet Balance */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center"><Wallet size={20} className="text-emerald-400" /></div>
                  <div>
                    <p className="text-xs text-slate-500">Your Balance</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(wallet?.balance || 0)}</p>
                  </div>
                </div>
                <Info size={16} className="text-slate-600" />
              </div>

              {/* Amount Input */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Investment Amount</label>
                <div className="relative">
                  <IndianRupee size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder={`Minimum ${formatCurrency(business.minInvestment)}`}
                    className="input-field pl-12 py-4 text-xl font-bold text-center" />
                </div>
              </div>

              {/* Quick Amounts */}
              <div className="flex flex-wrap gap-2 mb-5">
                {quickAmounts.map(a => (
                  <button key={a} onClick={() => setAmount(a.toString())}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      Number(amount) === a ? 'bg-brand-500 text-white shadow-brand' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}>₹{(a/1000).toFixed(0)}K</button>
                ))}
              </div>

              {/* ROI Calculator */}
              {amount && Number(amount) >= 1000 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 to-brand-500/5 border border-emerald-500/10 mb-5">
                  <p className="text-xs text-slate-400 flex items-center gap-2 mb-3"><Calculator size={14} className="text-brand-400" />Estimated Returns ({business.returnRate}% p.m.)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                      <p className="text-[10px] text-slate-500 uppercase">Monthly</p>
                      <p className="text-xl font-extrabold text-emerald-400 mt-0.5">₹{Number(monthlyReturn).toLocaleString()}</p>
                    </div>
                    <div className="text-center bg-brand-500/5 rounded-lg p-3 border border-brand-500/10">
                      <p className="text-[10px] text-slate-500 uppercase">Annually</p>
                      <p className="text-xl font-extrabold text-brand-400 mt-0.5">₹{Number(annualReturn).toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action */}
              <button onClick={handleInvest} disabled={investing || !amount || Number(amount) < 1000}
                className="btn-primary w-full justify-center py-4 text-base font-bold flex items-center gap-2 disabled:opacity-40 shadow-brand tracking-wide">
                {investing ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
                {investing ? 'Processing Payment...' : `Invest ₹${amount ? Number(amount).toLocaleString() : '0'}`}
              </button>
              <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-slate-500">
                <Shield size={12} className="text-emerald-400" />
                Funds secured in escrow • Protected by CapitalX
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
