'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { businessApi } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Building2, Upload, Camera, Loader2, Zap,
  ArrowLeft, CheckCircle2, IndianRupee, MapPin, Globe,
  Users, Calendar, Plus, X, ChevronRight, TrendingUp, Info,
  User, Phone, CreditCard, FileText
} from 'lucide-react';
import Link from 'next/link';

const INDUSTRIES = [
  'Food & Beverage', 'Health & Fitness', 'Manufacturing', 'Hospitality',
  'Education', 'Agriculture', 'Technology', 'Retail', 'Healthcare',
  'Real Estate', 'Transport', 'Fashion', 'Media', 'Other'
];

const TENURES = [
  { value: 6, label: '6 months' },
  { value: 12, label: '12 months' },
  { value: 18, label: '18 months' },
  { value: 24, label: '24 months' },
  { value: 36, label: '36 months' },
];

function getAutoReturnRate(targetAmount: number): number {
  if (!targetAmount || targetAmount <= 0) return 1;
  if (targetAmount <= 2500000) return 1;
  if (targetAmount <= 5000000) return 1.5;
  if (targetAmount <= 10000000) return 2;
  return 2.5;
}

function getTierInfo(targetAmount: number): { rate: number; label: string; yearly: number } {
  const rate = getAutoReturnRate(targetAmount);
  let label = '';
  if (targetAmount <= 0) label = 'Enter funding goal first';
  else if (targetAmount <= 2500000) label = 'Tier 1: Up to ₹25L';
  else if (targetAmount <= 5000000) label = 'Tier 2: ₹25L-50L';
  else if (targetAmount <= 10000000) label = 'Tier 3: ₹50L-1Cr';
  else label = 'Tier 4: Above ₹1Cr';
  return { rate, label, yearly: rate * 12 };
}

export default function CreateBusinessPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '', industry: '', description: '',
    targetAmount: '', minInvestment: '5000',
    tenureMonths: '12', location: '', website: '',
    foundedYear: '', teamSize: '',
    highlights: [] as string[], tagInput: '',
    // 🔥 Owner Details
    ownerName: '', ownerPhone: '',
    aadhaarName: '', aadhaarNumber: '',
    panName: '', panNumber: '',
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  const targetAmt = Number(form.targetAmount) || 0;
  const tierInfo = getTierInfo(targetAmt);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addHighlight = () => {
    if (form.tagInput.trim() && form.highlights.length < 6) {
      setForm({ ...form, highlights: [...form.highlights, form.tagInput.trim()], tagInput: '' });
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.industry || !form.targetAmount) {
      toast.error('Please fill all required fields');
      return;
    }
    if (targetAmt < 50000) {
      toast.error('Minimum funding goal is ₹50,000');
      return;
    }
    if (!form.ownerName || !form.ownerPhone) {
      toast.error('Owner name and phone are required');
      return;
    }
    if (!form.aadhaarName || !form.aadhaarNumber) {
      toast.error('Aadhaar details are required');
      return;
    }
    if (!form.panName || !form.panNumber) {
      toast.error('PAN details are required');
      return;
    }
    setSubmitting(true);
    try {
      await businessApi.create({
        name: form.name,
        industry: form.industry,
        description: form.description,
        targetAmount: targetAmt,
        minInvestment: Number(form.minInvestment),
        returnRate: tierInfo.rate,
        tenureMonths: parseInt(form.tenureMonths),
        registrationNo: 'REG-' + Date.now(),
        taxId: 'TAX-' + Date.now(),
        website: form.website || undefined,
        highlights: form.highlights,
        // 🔥 Owner details
        ownerName: form.ownerName,
        ownerPhone: form.ownerPhone,
        aadhaarName: form.aadhaarName,
        aadhaarNumber: form.aadhaarNumber,
        panName: form.panName,
        panNumber: form.panNumber,
      });
      setSuccess(true);
      toast.success('Business submitted for verification!');
      setTimeout(() => router.push('/businesses'), 2500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create business');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return form.name && form.industry && form.description;
    if (step === 2) return targetAmt >= 50000;
    return true;
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto text-center py-20">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Business Submitted!</h2>
          <p className="text-slate-400 mt-2">Your business is under review. We'll verify and notify you within 48 hours.</p>
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2 mt-6 px-6 py-3">
            Go to Dashboard <ArrowLeft size={16} />
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/businesses" className="text-slate-400 hover:text-white"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">List Your Business</h1>
            <p className="text-slate-500 text-sm">Step {step} of 3 — {step === 1 ? 'Basic Info' : step === 2 ? 'Financial Details' : 'Owner & Logo'}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-brand-gradient' : 'bg-white/10'}`} />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Business Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="e.g., Mumbai Chai Company" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Industry *</label>
              <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="input-field cursor-pointer">
                <option value="" className="bg-surface">Select industry</option>
                {INDUSTRIES.map(ind => <option key={ind} value={ind} className="bg-surface">{ind}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Description *</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={4} placeholder="Describe your business..." className="input-field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Location</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                  placeholder="City, State" className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Website</label>
                <input value={form.website} onChange={e => setForm({...form, website: e.target.value})}
                  placeholder="https://" className="input-field" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Financial Details */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                <IndianRupee size={14} /> Funding Goal (₹) *
              </label>
              <input type="number" value={form.targetAmount} onChange={e => setForm({...form, targetAmount: e.target.value})}
                placeholder="Min ₹50,000" className="input-field font-mono text-lg" />
            </div>

            {targetAmt >= 50000 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-emerald-500/10 to-brand-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={18} className="text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Return Rate (Auto-Calculated)</h3>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full ml-auto">{tierInfo.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase">Monthly</p>
                    <p className="text-2xl font-extrabold text-emerald-400">{tierInfo.rate}%</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase">Yearly</p>
                    <p className="text-2xl font-extrabold text-brand-400">{tierInfo.yearly}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400">
                  <Info size={12} className="text-brand-400" />
                  Return rate is auto-calculated based on your funding goal. You cannot change this.
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Tenure *</label>
                <select value={form.tenureMonths} onChange={e => setForm({...form, tenureMonths: e.target.value})} className="input-field cursor-pointer">
                  {TENURES.map(t => <option key={t.value} value={t.value} className="bg-surface">{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Min Investment (₹)</label>
                <input type="number" value={form.minInvestment} onChange={e => setForm({...form, minInvestment: e.target.value})}
                  className="input-field font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Founded Year</label>
                <input type="number" value={form.foundedYear} onChange={e => setForm({...form, foundedYear: e.target.value})}
                  placeholder="e.g., 2022" className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Team Size</label>
                <input type="number" value={form.teamSize} onChange={e => setForm({...form, teamSize: e.target.value})}
                  placeholder="e.g., 10" className="input-field" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Owner Details + Logo */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-5">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <User size={20} className="text-brand-400" /> Owner Information
            </h3>
            <p className="text-xs text-slate-500 -mt-3">This information will be verified by our team and shown to admin only.</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Owner Name *</label>
                <input value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})}
                  placeholder="Full name" className="input-field" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Phone Number *</label>
                <input value={form.ownerPhone} onChange={e => setForm({...form, ownerPhone: e.target.value})}
                  placeholder="+91 98765 43210" className="input-field" />
              </div>
            </div>

            <div className="border-t border-white/8 pt-4">
              <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                <CreditCard size={18} className="text-brand-400" /> Aadhaar Card Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Name on Aadhaar *</label>
                  <input value={form.aadhaarName} onChange={e => setForm({...form, aadhaarName: e.target.value})}
                    placeholder="As per Aadhaar" className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Aadhaar Number *</label>
                  <input value={form.aadhaarNumber} onChange={e => setForm({...form, aadhaarNumber: e.target.value})}
                    placeholder="XXXX XXXX XXXX" className="input-field" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/8 pt-4">
              <h3 className="font-bold text-white flex items-center gap-2 mb-3">
                <FileText size={18} className="text-brand-400" /> PAN Card Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Name on PAN *</label>
                  <input value={form.panName} onChange={e => setForm({...form, panName: e.target.value})}
                    placeholder="As per PAN card" className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">PAN Number *</label>
                  <input value={form.panNumber} onChange={e => setForm({...form, panNumber: e.target.value})}
                    placeholder="ABCDE1234F" className="input-field" />
                </div>
              </div>
            </div>

            {/* Business Logo */}
            <div className="border-t border-white/8 pt-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Business Logo (Optional)</label>
              <label className="flex items-center justify-center h-28 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/30 cursor-pointer bg-white/[0.02] transition-all">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-contain rounded-xl p-2" />
                ) : (
                  <div className="text-center"><Camera size={24} className="text-slate-500 mx-auto mb-1" /><p className="text-xs text-slate-500">Upload Logo</p></div>
                )}
                <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
              </label>
            </div>

            {/* Key Highlights */}
            <div className="border-t border-white/8 pt-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Key Highlights</label>
              <div className="flex gap-2">
                <input value={form.tagInput} onChange={e => setForm({...form, tagInput: e.target.value})}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  placeholder="e.g., 2000+ customers" className="input-field flex-1" />
                <button onClick={addHighlight} className="px-4 py-2 rounded-xl bg-brand-500/20 text-brand-400 text-sm">Add</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.highlights.map((h, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-brand-500/10 text-brand-400 px-3 py-1.5 rounded-full">
                    {h} <button onClick={() => setForm({...form, highlights: form.highlights.filter((_, j) => j !== i)})}><X size={12} /></button>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
            className="glass-card px-5 py-2.5 text-sm text-slate-400 hover:text-white disabled:opacity-30">Back</button>
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="btn-primary px-8 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              {submitting ? 'Submitting...' : 'Submit Business'}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
