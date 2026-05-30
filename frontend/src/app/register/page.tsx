'use client';
import toast from "react-hot-toast";
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Sparkles, TrendingUp, Shield, Zap, BadgeCheck, Globe } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'INVESTOR' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!form.firstName || !form.lastName) { setError('Please fill all fields'); return; }
    if (!form.email) { setError('Email is required'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setIsSubmitting(true);
    try {
      await registerUser({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, role: form.role });
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
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
              Start Your<br /><span className="gradient-text">Investment</span><br />Journey
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-md">
              Create your free account in 30 seconds. Browse verified businesses, invest from ₹1,000, and earn fixed monthly returns.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: 'Escrow Protected', desc: 'Your funds always safe' },
              { icon: BadgeCheck, label: 'Verified Businesses', desc: 'AI + human checked' },
              { icon: Zap, label: 'Instant Setup', desc: 'Ready in 30 seconds' },
              { icon: Globe, label: 'From ₹1,000', desc: 'Low minimum to start' },
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
        </div>
      </div>

      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-6 sm:p-10 border-l border-white/5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center"><TrendingUp size={20} className="text-white" /></div>
              <span className="font-display font-bold text-2xl gradient-text">CapitalX</span>
            </Link>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-white">Create account</h2>
            <p className="mt-2 text-slate-400">Start your investment journey today</p>
          </div>

          <div className="flex gap-2">
            {[1, 2].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-brand-gradient' : 'bg-white/10'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-xl bg-red-500/8 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                <AlertCircle size={18} className="flex-shrink-0" /> {error}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-300">First Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                        placeholder="John" className="input-field pl-12 py-3" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-300">Last Name</label>
                    <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                      placeholder="Doe" className="input-field py-3" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="you@company.com" className="input-field pl-12 py-3" />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)}
                  className="btn-primary w-full justify-center py-3.5 text-base font-bold">
                  Continue <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type={showPassword ? 'text' : 'password'} value={form.password}
                      onChange={e => setForm({...form, password: e.target.value})}
                      placeholder="Min 8 characters" className="input-field pl-12 pr-12 py-3" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {form.password && form.password.length < 8 && (
                    <p className="text-xs text-amber-400 mt-1">Password must be at least 8 characters</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300">I am a…</label>
                  <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                    className="input-field py-3 cursor-pointer">
                    <option value="INVESTOR" className="bg-surface">💰 Investor — I want to invest</option>
                    <option value="BUSINESS_OWNER" className="bg-surface">🏢 Business Owner — I want funding</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="glass-card flex-1 py-3.5 text-sm font-bold text-slate-400 hover:text-white transition-all">
                    ← Back
                  </button>
                  <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="btn-primary flex-1 justify-center py-3.5 text-base font-bold shadow-brand">
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
