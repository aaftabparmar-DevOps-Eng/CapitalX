'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, AlertCircle,
  TrendingUp, Shield, Zap, BadgeCheck, Users, Star, Building2, Globe
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter your password'); return; }
    setIsSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace(searchParams.get('redirect') || '/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Invalid credentials');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-14 relative overflow-hidden bg-gradient-to-br from-brand-600/5 via-surface to-purple-600/5">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-brand-500/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-purple-400/6 rounded-full blur-[100px]" />
        
        <div className="relative max-w-lg space-y-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
              <TrendingUp size={28} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-4xl gradient-text">CapitalX</span>
          </Link>

          <div>
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Invest Smart.<br />
              <span className="gradient-text">Earn Monthly.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-md">
              Join thousands of investors earning fixed returns from verified Indian businesses. 
              AI-powered, escrow protected, completely transparent.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: '100% Escrow Protected', desc: 'Funds never go directly to business' },
              { icon: BadgeCheck, label: 'AI Verified Businesses', desc: '200+ data points analyzed' },
              { icon: Zap, label: 'Fixed Monthly Returns', desc: 'Earn predictable income' },
              { icon: Globe, label: 'Start from ₹1,000', desc: 'Low minimum, high potential' },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-500/20 transition-all">
                <div className="w-10 h-10 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon size={18} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2"><Users size={16} className="text-brand-400" /><span><strong className="text-white">48,000+</strong> Investors</span></div>
            <div className="flex items-center gap-2"><Star size={16} className="text-amber-400" /><span><strong className="text-white">4.8/5</strong> Trust Score</span></div>
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-6 sm:p-10 border-l border-white/5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center"><TrendingUp size={20} className="text-white" /></div>
              <span className="font-display font-bold text-2xl gradient-text">CapitalX</span>
            </Link>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-white">Sign in</h2>
            <p className="mt-2 text-slate-400">Access your investment dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-xl bg-red-500/8 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                <AlertCircle size={18} className="flex-shrink-0" /> {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" disabled={isSubmitting} className="input-field pl-12 py-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 font-medium">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" disabled={isSubmitting} className="input-field pl-12 pr-12 py-3.5" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="btn-primary w-full justify-center py-3.5 text-base font-bold shadow-brand">
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
            </motion.button>
          </form>

          {/* About Button */}
          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div><div className="relative flex justify-center text-xs"><span className="bg-surface px-3 text-slate-500">learn more</span></div></div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass-card p-4">
            <Link href="/about" className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-400/20">
                  <Building2 size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">About CapitalX</p>
                  <p className="text-xs text-slate-400 mt-0.5">Learn how we protect your investments</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>

          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div><div className="relative flex justify-center text-xs"><span className="bg-surface px-3 text-slate-500">quick demo access</span></div></div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { role: 'Investor', email: 'investor@capitalx.io', pass: 'Investor@123', icon: TrendingUp },
              { role: 'Business', email: 'business@capitalx.io', pass: 'Business@123', icon: Building2 },
            ].map(demo => (
              <button key={demo.role} onClick={() => { setEmail(demo.email); setPassword(demo.pass); }}
                className="glass-card p-3.5 text-center hover:border-brand-500/30 transition-all group">
                <demo.icon size={18} className="text-brand-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-white">{demo.role}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{demo.email}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500">
            New to CapitalX?{' '}
            <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
