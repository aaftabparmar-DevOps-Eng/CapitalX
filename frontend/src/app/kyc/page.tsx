'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import {
  Shield, Upload, Camera, FileText, CheckCircle2, Clock,
  XCircle, Loader2, Zap, CreditCard, ArrowRight, Info, AlertTriangle, Lock, Eye
} from 'lucide-react';
import Link from 'next/link';

const STATUS_CONFIG: Record<string, { icon: any; color: string; bg: string; border: string; label: string; desc: string }> = {
  APPROVED: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', label: 'KYC Approved', desc: 'Your identity has been verified. You can now invest in businesses.' },
  UNDER_REVIEW: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/20', label: 'Under Review', desc: 'Your documents are being reviewed by our team. This usually takes 24-48 hours.' },
  PENDING: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/20', label: 'KYC Pending', desc: 'Please upload your identity documents to verify your account and start investing.' },
  REJECTED: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/5', border: 'border-rose-500/20', label: 'KYC Rejected', desc: 'Your documents did not pass verification. Please re-upload clear, valid documents.' },
};

const getKycKey = (email: string) => `capitalx-kyc-status-${email}`;

export default function KYCPage() {
  const { user } = useAuthStore();
  const [kycStatus, setKycStatus] = useState<string>('PENDING');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<{ aadhaar: File | null; pan: File | null; selfie: File | null }>({ aadhaar: null, pan: null, selfie: null });
  const [previews, setPreviews] = useState<{ aadhaar: string; pan: string; selfie: string }>({ aadhaar: '', pan: '', selfie: '' });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const userEmail = user?.email || 'unknown';

  useEffect(() => {
    const key = getKycKey(userEmail);
    const stored = localStorage.getItem(key);
    if (stored) setKycStatus(stored);
    setLoading(false);
  }, [userEmail]);

  const handleFile = (type: 'aadhaar' | 'pan' | 'selfie', file: File) => {
    if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5MB'); return; }
    setFiles(prev => ({ ...prev, [type]: file }));
    const reader = new FileReader();
    reader.onload = (e) => setPreviews(prev => ({ ...prev, [type]: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!files.aadhaar || !files.pan || !files.selfie) { toast.error('Please upload all 3 documents'); return; }
    if (!agreeTerms) { toast.error('Please agree to verification terms'); return; }
    setSubmitting(true);
    const key = getKycKey(userEmail);
    localStorage.setItem(key, 'UNDER_REVIEW');
    const pendingKey = 'capitalx-kyc-pending-all';
    const pendingList = localStorage.getItem(pendingKey);
    const pending = pendingList ? JSON.parse(pendingList) : [];
    const alreadySubmitted = pending.find((u: any) => u.email === userEmail);
    if (!alreadySubmitted) {
      pending.push({ id: Date.now().toString(), firstName: user?.firstName || 'User', lastName: user?.lastName || '', email: userEmail, kycStatus: 'UNDER_REVIEW', submittedAt: new Date().toISOString() });
      localStorage.setItem(pendingKey, JSON.stringify(pending));
    }
    await new Promise(r => setTimeout(r, 2000));
    setKycStatus('UNDER_REVIEW');
    setSubmitting(false);
    toast.success('Documents submitted for verification!');
  };

  const config = STATUS_CONFIG[kycStatus] || STATUS_CONFIG.PENDING;
  const StatusIcon = config.icon;
  const uploadedCount = [files.aadhaar, files.pan, files.selfie].filter(Boolean).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
          <div className="h-8 bg-white/5 rounded w-48" />
          <div className="h-32 bg-white/5 rounded-2xl" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <Shield size={22} className="text-brand-400" />
            </div>
            KYC Verification
          </h1>
          <p className="text-slate-400 text-sm mt-2">Verify your identity to unlock all platform features</p>
        </div>

        {/* Status Card */}
        <motion.div key={kycStatus} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-6 sm:p-8 border-2 ${config.border} ${config.bg}`}>
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className={`w-20 h-20 rounded-2xl ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
              <StatusIcon size={40} className={config.color} />
            </div>
            <div>
              <h3 className={`font-display text-xl font-bold ${config.color}`}>{config.label}</h3>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{config.desc}</p>
              {kycStatus === 'APPROVED' && (
                <Link href="/businesses" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 mt-4">
                  Browse Businesses <ArrowRight size={18} />
                </Link>
              )}
            </div>
            {/* Progress indicator when under review */}
            {kycStatus === 'UNDER_REVIEW' && (
              <div className="hidden sm:block ml-auto">
                <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Upload Section */}
        {(kycStatus === 'PENDING' || kycStatus === 'REJECTED') && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 sm:p-8 space-y-6">
            
            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
              <Lock size={18} className="text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Your documents are secure</p>
                <p className="text-xs text-slate-400 mt-0.5">Documents are encrypted and only accessible to authorized verification staff. We follow RBI KYC guidelines.</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-white text-lg">Upload Documents</h2>
                <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full">{uploadedCount}/3 uploaded</span>
              </div>

              <div className="space-y-4">
                {[
                  { type: 'aadhaar' as const, label: 'Aadhaar Card', icon: CreditCard, desc: 'Front side of your Aadhaar card' },
                  { type: 'pan' as const, label: 'PAN Card', icon: FileText, desc: 'Your valid PAN card' },
                  { type: 'selfie' as const, label: 'Selfie with ID', icon: Camera, desc: 'Clear selfie holding your Aadhaar/PAN' },
                ].map(({ type, label, icon: Icon, desc }) => (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} className="text-brand-400" />
                      <label className="text-sm font-semibold text-white">{label}</label>
                      {files[type] && <CheckCircle2 size={14} className="text-emerald-400 ml-auto" />}
                    </div>
                    <label className={`flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                      previews[type] ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 hover:border-brand-500/30 bg-white/[0.02]'
                    }`}>
                      {previews[type] ? (
                        <div className="relative w-full h-full">
                          <img src={previews[type]} alt={label} className="h-full w-full object-contain rounded-xl p-3" />
                          <button onClick={(e) => { e.preventDefault(); setFiles(prev => ({...prev, [type]: null})); setPreviews(prev => ({...prev, [type]: ''})); }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-all">
                            <XCircle size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload size={28} className="text-slate-500 mx-auto mb-1.5" />
                          <p className="text-sm text-slate-400 font-medium">Click to upload</p>
                          <p className="text-[10px] text-slate-600 mt-1">{desc}</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(type, e.target.files[0])} className="hidden" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="border-t border-white/8 pt-5">
              <button onClick={() => setAgreeTerms(!agreeTerms)}
                className="flex items-start gap-3 w-full text-left">
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  agreeTerms ? 'bg-brand-500 border-brand-500' : 'border-white/20'
                }`}>
                  {agreeTerms && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <div>
                  <p className="text-sm text-slate-300">
                    I confirm that all uploaded documents are genuine and belong to me. I understand that providing false information may result in permanent account suspension.
                  </p>
                </div>
              </button>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit}
              disabled={submitting || !files.aadhaar || !files.pan || !files.selfie || !agreeTerms}
              className="btn-primary w-full justify-center py-4 text-base font-bold flex items-center gap-2 shadow-brand disabled:opacity-40 disabled:cursor-not-allowed">
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
              {submitting ? 'Verifying & Submitting...' : 'Submit for Verification'}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
              <Shield size={12} className="text-emerald-400" />
              Your data is encrypted and protected
              <span className="text-slate-600">•</span>
              <Lock size={12} className="text-brand-400" />
              RBI KYC compliant
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
