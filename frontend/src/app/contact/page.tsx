'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, MessageSquare, Send, Loader2,
  CheckCircle2, Sparkles, ArrowRight, Headphones,
  Clock, Shield, Zap, Star, ChevronDown, ChevronUp,
  Building2, Globe, Users, HeartHandshake, Trophy,
  LifeBuoy, HelpCircle, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const contactCards = [
  { icon: Mail, label: 'Email Us', value: 'hello@capitalx.io', href: 'mailto:hello@capitalx.io', desc: 'Reply within 2 hours', color: 'from-blue-500/20 to-blue-600/20 text-blue-400' },
  { icon: Phone, label: 'Call Us', value: '+1 (555) 123-4567', href: 'tel:+15551234567', desc: 'Mon-Fri, 9AM-6PM EST', color: 'from-purple-500/20 to-purple-600/20 text-purple-400' },
  { icon: MapPin, label: 'Visit Us', value: 'San Francisco, CA', href: '#', desc: '123 Innovation Drive, Suite 400', color: 'from-cyan-500/20 to-cyan-600/20 text-cyan-400' },
  { icon: MessageSquare, label: 'Live Chat', value: 'Start conversation', href: '#', desc: 'Available 24/7', color: 'from-green-500/20 to-green-600/20 text-green-400' },
];

const stats = [
  { icon: Clock, value: '< 2 hrs', label: 'Avg Response' },
  { icon: HeartHandshake, value: '98%', label: 'Satisfaction' },
  { icon: Trophy, value: '24/7', label: 'Support' },
  { icon: Users, value: '50+', label: 'Specialists' },
];

const faqs = [
  { q: 'How does AI verification work?', a: 'Our AI analyzes 200+ data points per business — financial health, market dynamics, founder background, legal compliance. Each business gets a Trust Score from 0-100.' },
  { q: 'What is the minimum investment?', a: 'Minimum starts at just $100. Premium deals may require $1,000+. Diversify across multiple businesses to spread risk.' },
  { q: 'How are returns calculated?', a: 'Returns are fixed-rate, pre-agreed, and paid automatically to your wallet each month. You see projected returns before investing.' },
  { q: 'Is my investment protected?', a: 'Yes. All funds in regulated escrow. FDIC insured up to $250K. SOC 2 Type II certified.' },
  { q: 'How do I start?', a: 'Create free account (2 min), verify identity, browse AI-verified deals, choose investments, earn monthly returns.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', category: 'general' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/8 bg-surface/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">CapitalX</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white">Sign In</Link>
          <Link href="/register" className="btn-primary px-4 py-2 text-sm">Get Started</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-xl mb-5">
            <Headphones size={16} className="text-blue-400" /> 24/7 Premium Support
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            We're here to <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">help</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Our team of investment specialists and AI engineers is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((card, i) => (
            <motion.a key={card.label} href={card.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
              className="glass-card p-4 text-center group hover:border-brand-500/30 transition-all">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <card.icon size={20} />
              </div>
              <p className="text-sm font-semibold text-white">{card.label}</p>
              <p className="text-xs text-brand-400 mt-1 group-hover:text-brand-300">{card.value}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{card.desc}</p>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }} className="glass-card p-3 text-center">
              <s.icon size={18} className="text-brand-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h2 className="font-display font-semibold text-white text-lg mb-1">Send a Message</h2>
              <p className="text-xs text-slate-500 mb-5">We'll get back within 2 hours</p>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Message Sent!</h3>
                    <p className="text-sm text-slate-400 mt-1">We'll respond within 2 hours.</p>
                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '', category: 'general' }); }}
                      className="text-brand-400 text-sm mt-4 hover:text-brand-300">Send another →</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs text-slate-400 mb-1 block">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="input-field text-sm" placeholder="John Doe" /></div>
                      <div><label className="text-xs text-slate-400 mb-1 block">Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})} required type="email" className="input-field text-sm" placeholder="you@email.com" /></div>
                    </div>
                    <div><label className="text-xs text-slate-400 mb-1 block">Category</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field text-sm cursor-pointer">
                        <option value="general" className="bg-surface">General Inquiry</option>
                        <option value="investment" className="bg-surface">Investment Questions</option>
                        <option value="technical" className="bg-surface">Technical Support</option>
                        <option value="partnership" className="bg-surface">Partnership</option>
                      </select>
                    </div>
                    <div><label className="text-xs text-slate-400 mb-1 block">Subject</label><input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required className="input-field text-sm" placeholder="How can we help?" /></div>
                    <div><label className="text-xs text-slate-400 mb-1 block">Message</label><textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={4} className="input-field text-sm resize-none" placeholder="Tell us more..." /></div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3 flex items-center gap-2">
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-3">
              <h2 className="font-display font-semibold text-white flex items-center gap-2"><HelpCircle size={18} className="text-brand-400" /> FAQ</h2>
              {faqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="glass-card overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-3.5 text-left">
                    <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-brand-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-500 flex-shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="px-3.5 pb-3.5 text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
