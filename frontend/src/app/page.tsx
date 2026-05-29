'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp, Shield, Users, Sparkles, Zap, Globe, Lock,
  ArrowRight, CheckCircle2, Star, Building2, Wallet,
  BarChart3, Clock, IndianRupee, BrainCircuit, Target,
  ChevronRight, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const stats = [
  { icon: Users, value: '48,000+', label: 'Active Investors', color: 'text-blue-400' },
  { icon: Wallet, value: '₹150Cr+', label: 'Total Invested', color: 'text-emerald-400' },
  { icon: Building2, value: '1,240+', label: 'Verified Businesses', color: 'text-violet-400' },
  { icon: Shield, value: '99.7%', label: 'Fraud Detection', color: 'text-amber-400' },
];

const steps = [
  { step: '01', icon: Users, title: 'Create Account', desc: 'Sign up in 2 minutes and complete your KYC verification securely.' },
  { step: '02', icon: Building2, title: 'Browse Businesses', desc: 'Explore AI-verified businesses across India with complete transparency.' },
  { step: '03', icon: Wallet, title: 'Invest Securely', desc: 'Funds held in regulated escrow. Start from just ₹1,000.' },
  { step: '04', icon: TrendingUp, title: 'Earn Monthly', desc: 'Receive fixed returns every month. Track everything on your dashboard.' },
];

const features = [
  { icon: BrainCircuit, title: 'AI Risk Scoring', desc: '200+ data points analyzed per business for accurate risk assessment.' },
  { icon: Shield, title: 'Escrow Protected', desc: 'All investments held in secure escrow until verification is complete.' },
  { icon: CheckCircle2, title: 'Physical Verification', desc: 'Our team visits every business location for on-ground verification.' },
  { icon: Wallet, title: 'Fixed Monthly Returns', desc: 'Earn predictable income with tier-based returns from 1% to 2.5% monthly.' },
  { icon: Globe, Lock, title: 'Pan India Presence', desc: 'Businesses and investors from across India on one platform.' },
  { icon: Lock, title: 'Bank-Grade Security', desc: '256-bit encryption, SOC 2 compliant infrastructure.' },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      {/* ─── Navbar ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-surface/90 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand group-hover:scale-105 transition-transform">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">CapitalX</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {['Invest', 'How It Works', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">{item}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline text-sm text-slate-300 hover:text-white transition-colors font-medium">Sign In</Link>
            <Link href="/register" className="btn-primary px-5 py-2.5 text-sm font-semibold shadow-brand">
              <Sparkles size={16} /> Get Started
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-white">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 px-4 py-4 space-y-3 bg-surface/95 backdrop-blur-2xl">
            {['Invest', 'How It Works', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block text-sm text-slate-400 hover:text-white py-2">{item}</a>
            ))}
            <Link href="/login" className="block text-sm text-slate-300 hover:text-white py-2">Sign In</Link>
          </div>
        )}
      </header>

      {/* ─── Hero ───────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-brand-600/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px]" />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-300 backdrop-blur-xl mb-6">
            <Sparkles size={16} className="text-brand-400" /> AI-Powered Verified Investment Platform
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
            Invest Smart.<br className="sm:hidden" />
            <span className="bg-gradient-to-r from-brand-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent animate-gradient"> Earn Monthly.</span>
          </h1>
          
          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            India's most trusted platform for verified business investments. AI-powered risk scoring, escrow protection, and <span className="text-emerald-400 font-semibold">fixed monthly returns</span> — starting from just ₹1,000.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="btn-primary px-8 py-4 text-base font-bold flex items-center gap-2 shadow-brand hover:shadow-glow transition-all">
              Start Investing Now <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="glass-card px-8 py-4 text-base font-bold text-white hover:border-brand-500/30 transition-all flex items-center gap-2">
              Browse Businesses <ChevronRight size={20} />
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-slate-400">
            {[
              { icon: Shield, label: 'Escrow Protected' },
              { icon: BrainCircuit, label: 'AI Verified' },
              { icon: Users, label: '48,000+ Investors' },
              { icon: IndianRupee, label: 'From ₹1,000' },
            ].map(item => (
              <span key={item.label} className="flex items-center gap-2">
                <item.icon size={16} className="text-brand-400" /> {item.label}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Stats ──────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
              className="glass-card p-6 sm:p-8 text-center group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <s.icon size={28} className={s.color} />
              </div>
              <p className="text-3xl sm:text-4xl font-display font-extrabold text-white">{s.value}</p>
              <p className="text-sm text-slate-400 mt-1.5 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────── */}
      <section id="how-it-works" className="px-4 sm:px-6 py-20">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Simple Process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">How It Works</h2>
          <p className="text-slate-400 mt-3 max-w-md mx-auto">Four simple steps to start your investment journey</p>
        </div>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12 }} whileHover={{ y: -6 }}
              className="glass-card p-6 text-center relative group cursor-default">
              <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-sm font-extrabold text-white shadow-brand opacity-0 group-hover:opacity-100 transition-opacity">
                {item.step}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-brand-gradient/20 flex items-center justify-center mx-auto mb-4 shadow-brand/20">
                <item.icon size={26} className="text-brand-400" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">{item.title}</h3>
              <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ──────────────────────────────── */}
      <section className="px-4 sm:px-6 py-20">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Why Choose Us</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">Built for Trust</h2>
          <p className="text-slate-400 mt-3 max-w-md mx-auto">Every feature designed to protect your investment</p>
        </div>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <motion.div key={feat.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }}
              className="glass-card p-5 flex items-start gap-4 group cursor-default">
              <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-all">
                <feat.icon size={22} className="text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card p-10 sm:p-16 text-center bg-gradient-to-br from-brand-600/10 via-violet-600/10 to-cyan-600/10 border-brand-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px]" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Ready to Start Investing?</h2>
            <p className="mt-4 text-slate-400 max-w-lg mx-auto">
              Join 48,000+ investors earning fixed monthly returns from verified Indian businesses. Create your free account in 2 minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register" className="btn-primary px-8 py-4 text-base font-bold flex items-center gap-2 shadow-brand hover:shadow-glow transition-all">
                <Sparkles size={20} /> Create Free Account <ArrowRight size={20} />
              </Link>
              <Link href="/about" className="glass-card px-8 py-4 text-base font-bold text-white hover:border-brand-500/30 transition-all">
                Learn More
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> No hidden fees</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> ₹1,000 minimum</span>
              <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Withdraw anytime</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─────────────────────────────────── */}
      <footer className="border-t border-white/5 px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">Capital<span className="text-brand-400">X</span></span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-slate-600">© 2026 CapitalX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
