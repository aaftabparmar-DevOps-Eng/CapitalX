'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { businessApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { ReturnCalculator } from '@/components/investments/ReturnCalculator';
import Link from 'next/link';
import {
  Plus, Building2, TrendingUp, Shield, ArrowUpRight, Loader2, Search,
  Star, Clock, Users, DollarSign, Sparkles, Zap, ChevronRight,
  Target, AlertTriangle, CheckCircle2, Globe, SlidersHorizontal, X, MapPin
} from 'lucide-react';

const industries = ['All', 'Technology', 'Healthcare', 'Finance', 'Energy', 'Manufacturing', 'Food & Beverage', 'Hospitality', 'Education', 'Agriculture'];
const riskFilters = ['All', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];
const sortOptions = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'returnRate', label: 'Highest Return' },
  { value: 'targetAmount', label: 'Largest Target' },
  { value: 'raisedAmount', label: 'Most Funded' },
];

function RiskBadge({ level }: { level?: string }) {
  const config: Record<string, { icon: any; colors: string; label: string }> = {
    LOW: { icon: CheckCircle2, colors: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Low Risk' },
    MEDIUM: { icon: AlertTriangle, colors: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Medium' },
    HIGH: { icon: AlertTriangle, colors: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'High' },
    VERY_HIGH: { icon: AlertTriangle, colors: 'bg-red-900/20 text-red-400 border-red-500/30', label: 'Very High' },
  };
  if (!level || !config[level]) return null;
  const { icon: Icon, colors, label } = config[level];
  return <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${colors}`}><Icon size={10} />{label}</span>;
}

function SkeletonCard() {
  return <div className="glass-card p-5 space-y-4 animate-pulse"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-xl bg-white/5" /><div className="space-y-2 flex-1"><div className="h-4 bg-white/5 rounded w-3/4" /><div className="h-3 bg-white/5 rounded w-1/2" /></div></div><div className="h-16 bg-white/5 rounded" /><div className="grid grid-cols-3 gap-3">{[1,2,3].map(i=><div key={i} className="h-14 bg-white/5 rounded-lg"/>)}</div><div className="h-2 bg-white/5 rounded-full"/></div>;
}

export default function BusinessesPage() {
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [risk, setRisk] = useState('All');
  const [sort, setSort] = useState('createdAt');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    businessApi.getAll({ limit: 50 }).then(r => setBusinesses(r.data.data.data || r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = businesses.filter(b => {
    const ms = b.name?.toLowerCase().includes(search.toLowerCase()) || b.industry?.toLowerCase().includes(search.toLowerCase()) || b.description?.toLowerCase().includes(search.toLowerCase());
    return ms && (industry==='All'||b.industry===industry) && (risk==='All'||b.riskScore?.riskLevel===risk);
  }).sort((a,b) => {
    if(sort==='returnRate') return Number(b.returnRate)-Number(a.returnRate);
    if(sort==='targetAmount') return Number(b.targetAmount)-Number(a.targetAmount);
    if(sort==='raisedAmount') return Number(b.raisedAmount)-Number(a.raisedAmount);
    return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
  });

  const stats = {
    total: businesses.length,
    verified: businesses.filter(b=>b.status==='VERIFIED').length,
    avgReturn: businesses.length>0 ? (businesses.reduce((s,b)=>s+Number(b.returnRate||0),0)/businesses.length).toFixed(1) : '0',
    totalTarget: businesses.reduce((s,b)=>s+Number(b.targetAmount||0),0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Investment Opportunities</h1>
            <p className="text-slate-400 text-sm mt-1">Discover verified businesses seeking funding</p>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === 'BUSINESS_OWNER' && (
              <Link href="/businesses/create" className="btn-primary px-4 py-2.5 text-sm font-semibold shadow-brand">
                <Plus size={16} /> Add Your Business
              </Link>
            )}
            {user?.role !== 'INVESTOR' && (
              <div className="hidden lg:flex gap-2">
                {[{ icon: Building2, value: stats.total, label: 'Total', color: 'text-brand-400' },{ icon: CheckCircle2, value: stats.verified, label: 'Verified', color: 'text-emerald-400' },{ icon: TrendingUp, value: `${stats.avgReturn}%`, label: 'Avg Return', color: 'text-amber-400' }].map((s,i) => (
                  <div key={i} className="glass-card px-4 py-2.5 text-center"><s.icon size={16} className={`${s.color} mx-auto mb-0.5`} /><p className="text-sm font-bold text-white">{s.value}</p><p className="text-[10px] text-slate-500">{s.label}</p></div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Return Calculator for Investors */}
        {user?.role === 'INVESTOR' && (
          <div className="max-w-md">
            <ReturnCalculator />
          </div>
        )}

        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search businesses..." className="input-field pl-12 py-3 text-sm" />
            {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><X size={16}/></button>}
          </div>
          <div className="flex gap-2">
            <select value={sort} onChange={e=>setSort(e.target.value)} className="input-field py-3 px-4 text-sm w-44 cursor-pointer">{sortOptions.map(o=><option key={o.value} value={o.value} className="bg-surface">{o.label}</option>)}</select>
            <button onClick={()=>setShowFilters(!showFilters)} className={`glass-card px-4 py-3 flex items-center gap-2 text-sm font-medium transition-all ${showFilters?'border-brand-500/30 text-brand-400':'text-slate-400 hover:text-white'}`}>
              <SlidersHorizontal size={16}/> Filters {(industry!=='All'||risk!=='All')&&<span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-bold">!</span>}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden">
              <div className="glass-card p-5 flex flex-wrap gap-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Industry</label>
                  <div className="flex flex-wrap gap-1.5 max-w-md">{industries.map(ind=><button key={ind} onClick={()=>setIndustry(ind)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${industry===ind?'bg-brand-600/20 text-brand-400 border border-brand-500/30':'bg-white/5 text-slate-400 border border-transparent hover:border-white/10'}`}>{ind}</button>)}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Risk Level</label>
                  <div className="flex flex-wrap gap-1.5">{riskFilters.map(r=><button key={r} onClick={()=>setRisk(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${risk===r?'bg-brand-600/20 text-brand-400 border border-brand-500/30':'bg-white/5 text-slate-400 border border-transparent hover:border-white/10'}`}>{r==='All'?'All':r}</button>)}</div>
                </div>
                {(industry!=='All'||risk!=='All')&&<div className="flex items-end"><button onClick={()=>{setIndustry('All');setRisk('All')}} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"><X size={12}/> Clear</button></div>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="flex items-center justify-between"><p className="text-sm text-slate-400">Showing <span className="text-white font-semibold">{filtered.length}</span> of {businesses.length} businesses</p></div>

        {/* Business Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3,4,5,6].map(i=><SkeletonCard key={i}/>)}</div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-card p-16 text-center">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4"/><h3 className="text-lg font-semibold text-white mb-2">No businesses found</h3><p className="text-slate-500 text-sm mb-4">Try adjusting your search or filters</p>
            <button onClick={()=>{setSearch('');setIndustry('All');setRisk('All')}} className="text-brand-400 hover:text-brand-300 text-sm font-medium">Clear all filters →</button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((biz,i) => {
              const pct = Math.min((Number(biz.raisedAmount)/Number(biz.targetAmount))*100,100);
              return (
                <motion.div key={biz.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.04,duration:0.4}} whileHover={{y:-6,transition:{duration:0.2}}}
                  className="glass-card overflow-hidden group cursor-pointer hover:border-brand-500/40 transition-all flex flex-col">
                  {/* Card Header with gradient */}
                  <div className="p-5 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600/20 to-brand-800/20 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                          <Building2 size={22} className="text-brand-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-bold text-white text-sm truncate">{biz.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500">{biz.industry}</span>
                            <RiskBadge level={biz.riskScore?.riskLevel} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[2.5rem]">{biz.description||'No description available.'}</p>
                  </div>

                  {/* Metrics */}
                  <div className="px-5 pb-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-white/[0.02] rounded-xl p-2.5 text-center border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Target</p>
                        <p className="text-xs font-bold text-white font-mono mt-0.5">{formatCurrency(biz.targetAmount)}</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-2.5 text-center border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Return</p>
                        <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{biz.returnRate}%</p>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-2.5 text-center border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Tenure</p>
                        <p className="text-xs font-bold text-white font-mono mt-0.5">{biz.tenureMonths}mo</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
                        <span className="flex items-center gap-1"><Target size={10} className="text-brand-400" />{formatCurrency(biz.raisedAmount)} raised</span>
                        <span className="font-bold text-white">{pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{delay:0.4,duration:1}} className={`h-full rounded-full bg-gradient-to-r ${pct>=80?'from-emerald-500 to-emerald-400':pct>=50?'from-brand-500 to-brand-400':'from-amber-500 to-amber-400'}`}/>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto px-5 pb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Shield size={12} className="text-slate-400" />
                        <span>Min {formatCurrency(biz.minInvestment)}</span>
                      </div>
                      <Link href={`/businesses/${biz.id}`}
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-gradient px-4 py-2.5 rounded-xl hover:shadow-brand transition-all group-hover:gap-2.5">
                        Invest Now <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
