'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address'); return; }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsSent(true);
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
              Forgot<br />
              <span className="gradient-text">Password?</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-md">
              No worries! Enter your registered email and we'll send you a secure link to reset your password.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400 pt-4 border-t border-white/5">
            <span className="flex items-center gap-2">🔒 Secure reset link</span>
            <span className="flex items-center gap-2">⏱️ Valid for 15 minutes</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-6 sm:p-10 border-l border-white/5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center"><TrendingUp size={20} className="text-white" /></div>
              <span className="font-display font-bold text-2xl gradient-text">CapitalX</span>
            </Link>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-white">Reset Password</h2>
            <p className="mt-2 text-slate-400">Enter your email to receive a reset link</p>
          </div>

          {isSent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 size={44} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Check Your Email</h3>
              <p className="text-slate-400 text-sm">
                We've sent a password reset link to <span className="text-white font-semibold">{email}</span>
              </p>
              <p className="text-xs text-slate-500">
                Didn't receive the email? Check spam or{' '}
                <button onClick={() => setIsSent(false)} className="text-brand-400 hover:text-brand-300 underline">
                  try again
                </button>
              </p>
              <Link href="/login" className="btn-primary inline-flex px-6 py-2.5 text-sm mt-2">
                ← Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-red-500/8 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  <AlertCircle size={18} className="flex-shrink-0" /> {error}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com" autoComplete="email" disabled={isSubmitting}
                    className="input-field pl-12 py-3.5 text-base" />
                </div>
              </div>

              <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full justify-center py-3.5 text-base font-bold shadow-brand">
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500">
            Remember your password?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
