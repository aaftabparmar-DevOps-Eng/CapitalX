'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { adminApi, escrowApi, businessApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  Users, Building2, TrendingUp, Shield, Loader2, Check, X,
  Clock, CheckCircle2, Wallet, FileCheck, IndianRupee,
  Eye, Trash2, Search, RefreshCw, Umbrella, Scale, Ban, ThumbsUp,
  User, Phone, Mail, AlertTriangle, Sparkles, Zap, Activity
} from 'lucide-react';
import Link from 'next/link';

const KYC_PENDING_KEY = 'capitalx-kyc-pending-all';
const HISTORY_KEY = 'capitalx-admin-history';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function saveHistory(action: any) {
  const stored = localStorage.getItem(HISTORY_KEY);
  const history = stored ? JSON.parse(stored) : [];
  history.unshift({ ...action, timestamp: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
}

export default function AdminPage() {
  const [feesEarned, setFeesEarned] = useState<any>({});
  const [ipfStats, setIpfStats] = useState<any>({});
  const [stats, setStats] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [kycPending, setKycPending] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'kyc' | 'escrow' | 'history'>('overview');
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchBiz, setSearchBiz] = useState('');

  useEffect(() => {
    loadData();
    const stored = localStorage.getItem(KYC_PENDING_KEY);
    if (stored) try { setKycPending(JSON.parse(stored)); } catch {}
    const hist = localStorage.getItem(HISTORY_KEY);
    if (hist) try { setHistory(JSON.parse(hist)); } catch {}
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      const [sRes, bRes, eRes, fRes, ipfRes] = await Promise.all([
        adminApi.getDashboard(), businessApi.getAllAdmin({ limit: 200 }), escrowApi.getAll({ limit: 100 }),
        fetch(`${API_URL}/escrow/fees`, { headers }).then(r => r.json()).catch(() => ({})),
        fetch(`${API_URL}/investments/ipf-stats`, { headers }).then(r => r.json()).catch(() => ({})),
      ]);
      setStats(sRes.data.data);
      setBusinesses(bRes.data.data?.data || bRes.data.data || []);
      setEscrows(eRes.data.data?.data || []);
      setFeesEarned(fRes.data || fRes || {});
      setIpfStats(ipfRes.data || ipfRes || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleApproveBiz = async (id: string) => { setProcessing(id); try { await businessApi.approve(id); saveHistory({ type: 'APPROVED', message: 'Business approved' }); toast.success('Approved!'); loadData(); } catch { toast.error('Failed'); } setProcessing(null); };
  const handleRejectBiz = async (id: string) => { const reason = prompt('Rejection reason:'); if (!reason) return; setProcessing(id); try { await businessApi.reject(id, reason); saveHistory({ type: 'REJECTED', message: `Rejected: ${reason}` }); toast.success('Rejected'); loadData(); } catch { toast.error('Failed'); } setProcessing(null); };
  const handleDeleteBiz = async (id: string) => { if (!window.confirm('PERMANENTLY DELETE? This cannot be undone!')) return; setProcessing(id); try { await businessApi.delete(id); saveHistory({ type: 'DELETED', message: 'Business deleted' }); toast.success('Deleted!'); loadData(); } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed'); } setProcessing(null); };
  const handleRelease = async (id: string) => { setProcessing(id); try { await escrowApi.release(id, 'Approved'); saveHistory({ type: 'RELEASED', message: 'Escrow released' }); toast.success('Released! Fee deducted.'); loadData(); } catch { toast.error('Failed'); } setProcessing(null); };
  const handleRefund = async (id: string) => { setProcessing(id); try { await escrowApi.refund(id, 'Refunded by admin'); saveHistory({ type: 'REFUNDED', message: 'Escrow refunded' }); toast.success('Refunded!'); loadData(); } catch { toast.error('Failed'); } setProcessing(null); };
  const handleKYCApprove = (email: string) => { localStorage.setItem(`capitalx-kyc-status-${email}`, 'APPROVED'); setKycPending(p => p.filter(u => u.email !== email)); localStorage.setItem(KYC_PENDING_KEY, JSON.stringify(kycPending.filter(u => u.email !== email))); saveHistory({ type: 'KYC_APPROVED', message: `KYC: ${email}` }); toast.success('KYC Approved!'); };
  const handleKYCReject = (email: string) => { localStorage.setItem(`capitalx-kyc-status-${email}`, 'REJECTED'); setKycPending(p => p.filter(u => u.email !== email)); localStorage.setItem(KYC_PENDING_KEY, JSON.stringify(kycPending.filter(u => u.email !== email))); saveHistory({ type: 'KYC_REJECTED', message: `KYC: ${email}` }); toast.success('KYC Rejected'); };

  const pendingBiz = businesses.filter(b => b.status === 'PENDING_REVIEW' || b.status === 'DRAFT');
  const allBiz = businesses.filter(b => b.name?.toLowerCase().includes(searchBiz.toLowerCase()));
  const lockedEscrows = escrows.filter(e => e.status === 'LOCKED');

  const getEscrowStyle = (status: string) => {
    switch (status) {
      case 'LOCKED': return { bg: 'bg-amber-500/5', border: 'border-amber-500/20', badge: 'bg-amber-500/15 text-amber-400', label: '⏳ Pending', dot: 'bg-amber-400' };
      case 'RELEASED': return { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', badge: 'bg-emerald-500/15 text-emerald-400', label: '✅ Released', dot: 'bg-emerald-400' };
      case 'REFUNDED': return { bg: 'bg-rose-500/5', border: 'border-rose-500/20', badge: 'bg-rose-500/15 text-rose-400', label: '↩️ Refunded', dot: 'bg-rose-400' };
      default: return { bg: 'bg-slate-500/5', border: 'border-slate-500/20', badge: 'bg-slate-500/15 text-slate-400', label: status, dot: 'bg-slate-400' };
    }
  };

  const TABS = [
    { id: 'overview' as const, label: 'Overview', icon: Activity, count: null },
    { id: 'businesses' as const, label: 'Businesses', icon: Building2, count: pendingBiz.length },
    { id: 'kyc' as const, label: 'KYC', icon: FileCheck, count: kycPending.length },
    { id: 'escrow' as const, label: 'Escrow', icon: Wallet, count: lockedEscrows.length },
    { id: 'history' as const, label: 'History', icon: Clock, count: history.length },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-white/5 rounded w-40" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">{[1,2,3,4,5].map(i=><div key={i} className="glass-card p-5 h-28"/>)}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Shield size={28} className="text-brand-400" /> Admin Panel
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage businesses, KYC, escrow & platform operations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
            <button onClick={loadData} className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-white transition-all" title="Refresh data">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 border-b border-white/8 pb-3 overflow-x-auto scrollbar-thin">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all relative ${
                activeTab === tab.id ? 'bg-brand-600/20 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <tab.icon size={17} /> {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-brand-500/30 text-brand-300' : 'bg-amber-500/15 text-amber-400'
                }`}>{tab.count}</span>
              )}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ─────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-600/5' },
              { icon: Building2, label: 'Pending Business', value: pendingBiz.length, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-600/5' },
              { icon: IndianRupee, label: 'Platform Fees', value: '₹' + Number(feesEarned?.totalEarned || 0).toLocaleString('en-IN'), color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-600/5' },
              { icon: Umbrella, label: 'Protection Fund', value: '₹' + Number(ipfStats?.totalIPF || 0).toLocaleString('en-IN'), color: 'text-violet-400', bg: 'from-violet-500/10 to-violet-600/5' },
              { icon: Wallet, label: 'Escrow Locked', value: formatCurrency(stats?.lockedEscrow || 0), color: 'text-cyan-400', bg: 'from-cyan-500/10 to-cyan-600/5' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className={`glass-card p-5 bg-gradient-to-br ${s.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <s.icon size={22} className={s.color} />
                </div>
                <p className="text-2xl font-display font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── BUSINESSES ───────────────────────── */}
        {activeTab === 'businesses' && (
          <div className="space-y-5">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={searchBiz} onChange={e => setSearchBiz(e.target.value)}
                placeholder="Search businesses by name..." className="input-field pl-12 py-3 text-sm" />
            </div>

            {/* Pending Section */}
            {pendingBiz.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-400" />
                  <h3 className="font-display font-semibold text-white">Pending Approval ({pendingBiz.length})</h3>
                </div>
                {pendingBiz.map(biz => (
                  <motion.div key={biz.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-5 space-y-4 border-l-2 border-amber-500/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <Building2 size={24} className="text-brand-400" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-white text-lg">{biz.name}</p>
                          <p className="text-sm text-slate-400">{biz.industry} • Target: {formatCurrency(biz.targetAmount)} • {biz.returnRate}% return</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><User size={12} /> {biz.owner?.firstName} {biz.owner?.lastName}</span>
                            <span className="flex items-center gap-1"><Phone size={12} /> {biz.owner?.phone || 'N/A'}</span>
                            <span className="flex items-center gap-1"><Mail size={12} /> {biz.owner?.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleApproveBiz(biz.id)} disabled={processing === biz.id}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-2">
                          {processing === biz.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} />} Approve
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectBiz(biz.id)} disabled={processing === biz.id}
                          className="px-5 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 text-sm font-bold hover:bg-rose-500/30 transition-all flex items-center gap-2">
                          <X size={18} /> Reject
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* All Businesses */}
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-white">All Businesses ({allBiz.length})</h3>
              <div className="space-y-2">
                {allBiz.map(biz => (
                  <motion.div key={biz.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass-card p-4 flex items-center justify-between hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                        <Building2 size={20} className={biz.status === 'VERIFIED' ? 'text-emerald-400' : 'text-slate-500'} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{biz.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500">{biz.industry}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            biz.status === 'VERIFIED' ? 'bg-emerald-500/15 text-emerald-400' :
                            biz.status === 'REJECTED' ? 'bg-rose-500/15 text-rose-400' :
                            'bg-amber-500/15 text-amber-400'
                          }`}>{biz.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/businesses/${biz.id}`}
                        className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-all" title="View">
                        <Eye size={17} />
                      </Link>
                      <button onClick={() => handleDeleteBiz(biz.id)}
                        className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all" title="Delete">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── KYC ──────────────────────────────── */}
        {activeTab === 'kyc' && (
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-white">Pending Verification ({kycPending.length})</h3>
            {kycPending.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} className="text-emerald-400" />
                </div>
                <p className="text-white font-semibold text-lg">All Clear!</p>
                <p className="text-slate-400 text-sm mt-1">No pending KYC requests</p>
              </motion.div>
            ) : (
              kycPending.map(user => (
                <motion.div key={user.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-display font-bold text-white">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-slate-400">{user.email}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Submitted: {new Date(user.submittedAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleKYCApprove(user.email)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-2">
                      <Check size={18} /> Approve
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleKYCReject(user.email)}
                      className="px-5 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 text-sm font-bold hover:bg-rose-500/30 transition-all flex items-center gap-2">
                      <X size={18} /> Reject
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* ─── ESCROW ────────────────────────────── */}
        {activeTab === 'escrow' && (
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-white">Escrow Management ({escrows.length})</h3>
            {escrows.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 text-center">
                <Wallet size={48} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No escrow records found</p>
              </motion.div>
            ) : (
              escrows.map(escrow => {
                const style = getEscrowStyle(escrow.status);
                const netAmount = Number(escrow.amount) - (Number(escrow.platformFee) || Number(escrow.amount) * 0.03);
                return (
                  <motion.div key={escrow.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${style.bg} border ${style.border}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                        <p className="font-display font-bold text-white text-lg">{escrow.business?.name || 'Business'}</p>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${style.badge}`}>{style.label}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Investor</p>
                          <p className="text-white font-semibold">{escrow.investment?.investor?.firstName} {escrow.investment?.investor?.lastName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Amount</p>
                          <p className="text-white font-bold font-mono">{formatCurrency(escrow.amount)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Platform Fee (3%)</p>
                          <p className="text-amber-400 font-bold font-mono">{formatCurrency(escrow.platformFee || Number(escrow.amount) * 0.03)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Net to Business</p>
                          <p className="text-emerald-400 font-bold font-mono">{formatCurrency(netAmount)}</p>
                        </div>
                      </div>
                    </div>
                    {escrow.status === 'LOCKED' && (
                      <div className="flex gap-2 self-end">
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => handleRelease(escrow.id)} disabled={processing === escrow.id}
                          className="px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-2">
                          {processing === escrow.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} />} Release Funds
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => handleRefund(escrow.id)} disabled={processing === escrow.id}
                          className="px-5 py-3 rounded-xl bg-rose-500/20 text-rose-400 text-sm font-bold hover:bg-rose-500/30 transition-all flex items-center gap-2">
                          {processing === escrow.id ? <Loader2 size={16} className="animate-spin" /> : <Ban size={18} />} Refund
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* ─── HISTORY ───────────────────────────── */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-white">Action History ({history.length})</h3>
            {history.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-12 text-center">
                <Clock size={48} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No actions recorded yet</p>
              </motion.div>
            ) : (
              history.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                  className="glass-card p-4 flex items-center gap-4">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    item.type.includes('APPROVED') || item.type.includes('RELEASED') ? 'bg-emerald-400 shadow-sm shadow-emerald-400/30' :
                    item.type.includes('REJECTED') || item.type.includes('DELETED') || item.type.includes('REFUNDED') ? 'bg-rose-400' :
                    'bg-brand-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-200 font-medium">{item.message}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(item.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-full font-medium">{item.type}</span>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
