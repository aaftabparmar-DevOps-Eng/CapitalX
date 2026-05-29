'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp, Shield, Users, BrainCircuit, Building2,
  Wallet, Target, Globe, Zap, Star, CheckCircle2,
  ArrowRight, Lock, BarChart3, Clock, Sparkles,
  HeartHandshake, Eye, FileCheck, BadgeCheck, Rocket,
  AlertTriangle, Info, ChevronDown, ChevronUp, Mail, Phone,
  MapPin, Scale, IndianRupee, Percent
} from 'lucide-react';

const faqs = [
  {
    q: 'What is CapitalX?',
    a: 'CapitalX is India\'s AI-powered verified business investment platform. We connect verified Indian businesses with investors looking for fixed monthly returns. Every business undergoes AI analysis (200+ data points) + physical verification before listing. Investors can start from just ₹1,000.'
  },
  {
    q: 'How does the investment model work?',
    a: 'CapitalX uses a Hybrid Return Model: Fixed Monthly Return + Extra Profit Sharing. Returns are tier-based — determined by the business funding goal. All funds are held in secure escrow for complete investor protection.'
  },
  {
    q: 'What types of businesses can list on CapitalX?',
    a: 'ANY verified business can list — cafes, salons, gyms, clinics, hotels, manufacturing units, cloud kitchens, e-commerce brands, agriculture, dairy, transport, real estate projects, startups, franchises, pharmacies, tuition centers and more. Only condition: must pass AI + physical verification.'
  },
  {
    q: 'How are businesses verified?',
    a: 'Businesses submit documents (Aadhaar, PAN, GST, bank details, license, photos). Our AI engine analyzes 200+ data points. Then our verification team conducts physical on-ground verification. Only approved businesses get listed on the platform.'
  },
  {
    q: 'What are the investment rules?',
    a: 'Minimum investment: ₹1,000. Maximum investment: No limit. Investment type: One-time lump sum. Returns: Tier-based fixed monthly + variable profit share. Payout: Monthly to investor wallet. Fund holding: CapitalX secured escrow system. Tenure: 6-36 months.'
  },
  {
    q: 'Is my money safe?',
    a: 'Yes. All funds are held in regulated escrow accounts. We use 256-bit SSL encryption, SOC 2 Type II certified infrastructure, continuous AI fraud monitoring, and 1% Investor Protection Fund on every investment.'
  },
  {
    q: 'What documents do I need to invest?',
    a: 'You need to complete KYC verification — upload Aadhaar card, PAN card, and a selfie with ID. This is mandatory for all investors as per Indian regulations.'
  },
  {
    q: 'Can I withdraw my investment early?',
    a: 'Investment terms vary by business. Most have minimum lock-in periods (6-12 months). Early withdrawal terms are clearly stated before you invest. Earned returns can be withdrawn anytime to your wallet.'
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-white/8 bg-surface/90 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">CapitalX</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white">Sign In</Link>
          <Link href="/register" className="btn-primary px-4 py-2 text-sm">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-500/8 rounded-full blur-[120px]" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-brand-500/10 text-brand-400 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            AI-Powered • Verified • Secure
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            About <span className="gradient-text">CapitalX</span>
          </h1>
          <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            CapitalX is India's first AI-powered verified business investment platform. 
            We connect genuine Indian businesses with smart investors, offering tier-based 
            fixed monthly returns with complete transparency and escrow protection.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/register" className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
              Start Investing <ArrowRight size={16} />
            </Link>
            <Link href="/businesses" className="glass-card px-6 py-2.5 text-sm font-semibold text-white">
              Browse Businesses
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Target, title: 'Mission', desc: 'Democratize business investing in India. Make verified investment opportunities accessible to everyone, starting from just ₹1,000.' },
            { icon: Eye, title: 'Vision', desc: 'Become India\'s most trusted platform where every listed business is 100% verified, AI-monitored, and investor-friendly.' },
            { icon: HeartHandshake, title: 'Promise', desc: 'Zero tolerance for fraud. Every business undergoes AI + physical verification. Funds always secured in escrow.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <item.icon size={26} className="text-brand-400" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">{item.title}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* System Flow */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-8">How CapitalX Works</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500 via-violet-500 to-transparent hidden sm:block" />
          <div className="space-y-6">
            {[
              { step: '1', title: 'Business Applies', desc: 'Business owner submits application with documents — Aadhaar, PAN, GST, bank details, business license, photos/videos of the business.' },
              { step: '2', title: 'AI + Human Verification', desc: 'Our AI engine analyzes 200+ data points. Verification team conducts physical on-ground inspection. Fraud detection checks run automatically.' },
              { step: '3', title: 'Campaign Published', desc: 'Approved business gets listed with funding goal, auto-calculated return rate, tenure, AI trust score, risk level, and complete business details.' },
              { step: '4', title: 'Investors Invest', desc: 'Investors browse verified businesses, check AI scores, and invest starting from ₹1,000. All funds go directly to secure escrow.' },
              { step: '5', title: 'Funds Released to Business', desc: 'Once funding goal is met and all verifications pass, CapitalX releases funds to the business.' },
              { step: '6', title: 'Monthly Returns Paid', desc: 'Business pays fixed monthly returns + profit share to investors. Everything tracked transparently on investor dashboard.' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} className="flex gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-lg flex-shrink-0 relative z-10 shadow-brand">
                  {item.step}
                </div>
                <div className="glass-card p-4 flex-1">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔥 TIER-BASED RETURN RATES */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-8">Tier-Based Return Rates</h2>
        <p className="text-slate-400 text-sm text-center -mt-6 mb-8">
          Return rate is automatically determined by the business funding goal — business owners cannot change it manually.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tier: 'Tier 1', range: 'Up to ₹25 Lakhs', monthly: '1%', yearly: '12%', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30', textColor: 'text-emerald-400', example: '₹10,000 → ₹100/mo' },
            { tier: 'Tier 2', range: '₹25L - ₹50 Lakhs', monthly: '1.5%', yearly: '18%', color: 'from-brand-500/20 to-brand-600/10 border-brand-500/30', textColor: 'text-brand-400', example: '₹10,000 → ₹150/mo' },
            { tier: 'Tier 3', range: '₹50L - ₹1 Crore', monthly: '2%', yearly: '24%', color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30', textColor: 'text-violet-400', example: '₹10,000 → ₹200/mo' },
            { tier: 'Tier 4', range: 'Above ₹1 Crore', monthly: '2.5%', yearly: '30%', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30', textColor: 'text-amber-400', example: '₹10,000 → ₹250/mo' },
          ].map((tier, i) => (
            <motion.div key={tier.tier} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-5 text-center bg-gradient-to-br ${tier.color}`}>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{tier.tier}</p>
              <p className="text-sm text-slate-500 mb-3">{tier.range}</p>
              <p className={`text-4xl font-extrabold ${tier.textColor}`}>{tier.monthly}</p>
              <p className="text-xs text-slate-400 mt-1">Monthly ({tier.yearly} yearly)</p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-[10px] text-slate-500">Example</p>
                <p className="text-xs text-white font-semibold mt-0.5">{tier.example}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 justify-center mt-4 text-[11px] text-slate-500">
          <Info size={12} className="text-brand-400" />
          Return rates are auto-calculated based on funding goal. Higher funding = better returns for investors.
        </div>
      </section>

      {/* Investment Model */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-8">Investment Model</h2>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="glass-card p-6 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 border-emerald-500/10">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <h3 className="font-bold text-white">Fixed Monthly Return</h3>
            </div>
            <p className="text-sm text-slate-400 mb-3">Tier-based guaranteed minimum return every month</p>
            <div className="bg-emerald-500/10 rounded-xl p-4">
              <p className="text-xs text-slate-500">Example: ₹10,000 at Tier 1 (1%)</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">₹100/month</p>
              <p className="text-xs text-slate-500 mt-1">Fixed, guaranteed minimum</p>
            </div>
          </div>
          <div className="glass-card p-6 bg-gradient-to-br from-amber-500/5 to-amber-600/5 border-amber-500/10">
            <div className="flex items-center gap-2 mb-3">
              <Star size={20} className="text-amber-400" />
              <h3 className="font-bold text-white">Extra Profit Share</h3>
            </div>
            <p className="text-sm text-slate-400 mb-3">Additional bonus when business performs above target</p>
            <div className="bg-amber-500/10 rounded-xl p-4">
              <p className="text-xs text-slate-500">Example: Business exceeds targets</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">+₹50-₹300</p>
              <p className="text-xs text-slate-500 mt-1">Variable performance bonus</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Rules */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <div className="glass-card p-8">
          <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Scale size={24} className="text-brand-400" /> Platform Rules & Terms
          </h2>
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <IndianRupee size={16} className="text-brand-400" /> Investment Rules
              </h3>
              <ul className="space-y-1.5 text-slate-400 ml-6 list-disc">
                <li>Minimum investment: <span className="text-white font-semibold">₹1,000</span></li>
                <li>Maximum investment: <span className="text-white font-semibold">No limit</span></li>
                <li>Investment type: One-time lump sum</li>
                <li>Returns: <span className="text-white font-semibold">Tier-based fixed monthly</span> + variable profit share</li>
                <li>Return rates: 1% - 2.5% monthly (auto-calculated by funding goal)</li>
                <li>Payout: Monthly to investor wallet</li>
                <li>Fund holding: CapitalX secured escrow system</li>
                <li>Tenure: 6-36 months (depending on business)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Building2 size={16} className="text-brand-400" /> For Businesses
              </h3>
              <ul className="space-y-1.5 text-slate-400 ml-6 list-disc">
                <li>Valid Aadhaar, PAN, GST & business documents required</li>
                <li>Physical verification by CapitalX team mandatory</li>
                <li>Minimum funding goal: <span className="text-white font-semibold">₹50,000</span></li>
                <li><span className="text-white font-semibold">Platform fee: 3%</span> of total funds raised (deducted from business)</li>
                <li>Return rate is <span className="text-white font-semibold">auto-calculated</span> based on funding goal — cannot be changed</li>
                <li>Monthly performance reports to investors required</li>
                <li>Failed verification = listing rejected with reason</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Users size={16} className="text-brand-400" /> For Investors
              </h3>
              <ul className="space-y-1.5 text-slate-400 ml-6 list-disc">
                <li>KYC verification mandatory before investing</li>
                <li><span className="text-emerald-400 font-semibold">No platform fee for investors</span></li>
                <li>1% Investor Protection Fund auto-deducted for safety</li>
                <li>Funds held in escrow until business verification complete</li>
                <li>Wallet balance withdrawable anytime</li>
                <li>Investment locked for agreed tenure (6-36 months)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-medium text-white pr-4">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={18} className="text-brand-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-500 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-12 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-2xl font-bold text-white mb-4">Get In Touch</h2>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-2"><Mail size={16} className="text-brand-400" /> hello@capitalx.io</span>
          <span className="flex items-center gap-2"><Phone size={16} className="text-brand-400" /> +91 98765 43210</span>
          <span className="flex items-center gap-2"><MapPin size={16} className="text-brand-400" /> Surat, Gujarat, India</span>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto glass-card p-10 text-center bg-gradient-to-br from-brand-600/10 via-violet-600/10 to-cyan-600/10 border-brand-500/20">
          <h2 className="font-display text-3xl font-bold text-white">Ready to Start Investing?</h2>
          <p className="text-slate-400 mt-2">Join thousands of investors earning tier-based fixed monthly returns.</p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/register" className="btn-primary px-8 py-3 flex items-center gap-2">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link href="/businesses" className="glass-card px-8 py-3 font-semibold text-white">
              Browse Businesses
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8 py-6 text-center text-xs text-slate-600">
        © 2026 CapitalX — AI-Powered Verified Business Investment Platform. All rights reserved.
      </footer>
    </div>
  );
}
