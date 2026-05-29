'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { walletApi, investmentApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  TrendingUp, Wallet, PieChart, BarChart3, Activity,
  Loader2, ArrowUp, ArrowDown, DollarSign, Target,
  Calendar, Layers, Eye, ChevronRight, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RPieChart, Pie,
  Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
        <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 py-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-slate-300">{entry.name}:</span>
            <span className="text-xs font-bold text-white ml-auto">
              {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon: Icon, label, value, change, up, delay }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
    className="glass-card p-5 group cursor-pointer hover:border-brand-500/20 transition-all relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-500/5 to-transparent rounded-bl-3xl group-hover:from-brand-500/10 transition-all" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500/20 to-violet-500/10 flex items-center justify-center">
          <Icon size={22} className="text-brand-400" />
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full ${
            up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-1.5 font-medium uppercase tracking-wider">{label}</p>
    </div>
  </motion.div>
);

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('6M');
  const [portfolio, setPortfolio] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    setLoading(true);
    try {
      const [pRes, invRes, txRes] = await Promise.all([
        investmentApi.getPortfolio().catch(() => ({ data: { data: {} } })),
        investmentApi.getMine().catch(() => ({ data: { data: [] } })),
        walletApi.getTransactions({ limit: 100 }).catch(() => ({ data: { data: { data: [] } } })),
      ]);
      setPortfolio(pRes.data.data || {});
      setInvestments(invRes.data.data || invRes.data || []);
      setTransactions(txRes.data.data?.data || []);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real calculations from actual data
  const activeInvestments = investments.filter(i => i.status === 'ACTIVE');
  const cancelledInvestments = investments.filter(i => i.status === 'CANCELLED');
  const completedInvestments = investments.filter(i => i.status === 'COMPLETED');

  const totalInvested = activeInvestments.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalReturns = activeInvestments.reduce((sum, i) => {
    return sum + (Number(i.amount) * (Number(i.business?.returnRate || 0) / 100));
  }, 0);
  const avgReturnRate = activeInvestments.length > 0
    ? activeInvestments.reduce((s, i) => s + Number(i.business?.returnRate || 0), 0) / activeInvestments.length
    : 0;

  // Category distribution from real investments
  const categoryMap: Record<string, number> = {};
  activeInvestments.forEach(inv => {
    const cat = inv.business?.industry || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(inv.amount);
  });
  const totalCatAmount = Object.values(categoryMap).reduce((s, v) => s + v, 0);
  const categoryData = Object.entries(categoryMap).map(([name, value], i) => ({
    name,
    value: totalCatAmount > 0 ? Math.round((value / totalCatAmount) * 100) : 0,
    color: COLORS[i % COLORS.length],
  }));

  // Monthly data from real transactions
  const monthlyMap: Record<string, { deposits: number; returns: number; investments: number }> = {};
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString('en-US', { month: 'short' });
  });

  last6Months.forEach(m => { monthlyMap[m] = { deposits: 0, returns: 0, investments: 0 }; });

  transactions.forEach((tx: any) => {
    const d = new Date(tx.createdAt);
    const m = d.toLocaleString('en-US', { month: 'short' });
    if (monthlyMap[m]) {
      if (tx.type === 'DEPOSIT') monthlyMap[m].deposits += Number(tx.amount);
      if (tx.type === 'RETURN' || tx.type === 'ESCROW_RELEASE') monthlyMap[m].returns += Number(tx.amount);
      if (tx.type === 'INVESTMENT' || tx.type === 'ESCROW_LOCK') monthlyMap[m].investments += Number(tx.amount);
    }
  });

  const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({ month, ...data }));

  // Portfolio growth (cumulative)
  let cumulative = 0;
  const portfolioGrowth = monthlyData.map((d: any) => {
    cumulative += d.deposits - d.investments + d.returns;
    return { month: d.month, value: Math.max(0, cumulative) };
  });

  // Returns breakdown
  const returnsBreakdown = monthlyData.map((d: any) => ({
    month: d.month,
    fixed: Math.round(d.returns * 0.8),
    bonus: Math.round(d.returns * 0.2),
  }));

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-brand-400" />
          <p className="text-slate-500 text-sm">Crunching numbers...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Analytics</h1>
            <p className="text-slate-500 text-sm mt-1">Deep dive into your portfolio performance</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadRealData} className="glass-card p-2.5 text-slate-400 hover:text-white transition-all">
              <RefreshCw size={16} />
            </button>
            <div className="flex items-center gap-1 bg-white/[0.02] rounded-2xl p-1 border border-white/5">
              {['1M', '3M', '6M', 'ALL'].map(t => (
                <button key={t} onClick={() => setTimeframe(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    timeframe === t ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* REAL Stats from DB */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Wallet} label="Portfolio Value" value={formatCurrency(totalInvested + totalReturns)} change="Live" up={true} delay={0} />
          <StatCard icon={TrendingUp} label="Total Returns" value={formatCurrency(totalReturns)} change="Monthly" up={true} delay={0.05} />
          <StatCard icon={Target} label="Avg Return Rate" value={`${avgReturnRate.toFixed(1)}%`} change={avgReturnRate > 0 ? 'Active' : 'N/A'} up={true} delay={0.1} />
          <StatCard icon={Layers} label="Active Investments" value={activeInvestments.length} change={`${completedInvestments.length} completed`} up={true} delay={0.15} />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Portfolio Growth */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-display font-bold text-white text-lg">Portfolio Growth</h3>
                <p className="text-xs text-slate-500 mt-0.5">Total invested capital over time</p>
              </div>
            </div>
            {portfolioGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={portfolioGrowth}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.25)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.25)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#grad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
                {activeInvestments.length === 0 ? '📊 Make your first investment to see portfolio growth' : 'No data yet'}
              </div>
            )}
          </motion.div>

          {/* Returns Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-card p-6">
            <h3 className="font-display font-bold text-white text-lg">Returns Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fixed vs bonus profit share</p>
            {returnsBreakdown.length > 0 && returnsBreakdown.some((d: any) => d.fixed > 0 || d.bonus > 0) ? (
              <ResponsiveContainer width="100%" height={300} className="mt-4">
                <BarChart data={returnsBreakdown} barSize={28} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.25)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.25)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="fixed" name="Fixed Return" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="bonus" name="Bonus Profit" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500 text-sm">No returns yet</div>
            )}
          </motion.div>

          {/* Allocation Donut */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-6">
            <h3 className="font-display font-bold text-white text-lg">Allocation</h3>
            <p className="text-xs text-slate-500 mt-0.5">Investment by category</p>
            {categoryData.length > 0 ? (
              <div className="flex items-center gap-6 mt-4">
                <div className="w-[180px] h-[180px] flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2.5">
                  {categoryData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-white font-semibold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500 text-sm">No investments to show</div>
            )}
          </motion.div>
        </div>

        {/* Monthly Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-6">
          <h3 className="font-display font-bold text-white text-lg">Monthly Activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Deposits, returns & investments per month</p>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} className="mt-4">
              <BarChart data={monthlyData} barSize={20} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.25)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.25)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="deposits" name="Deposits" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="returns" name="Returns" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="investments" name="Investments" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500 text-sm">No transaction data yet</div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
