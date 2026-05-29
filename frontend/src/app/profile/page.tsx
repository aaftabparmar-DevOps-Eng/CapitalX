'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/auth.store';
import { usersApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Camera,
  Loader2, Check, X, Edit3, Save, BadgeCheck, Clock,
  Globe, Briefcase, Award, Star, Zap, Building2, Wallet,
  TrendingUp, Activity, Key, Eye, EyeOff, FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, refreshUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!form.firstName || !form.lastName) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      // Only send fields that backend accepts
      await usersApi.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });
      await refreshUser();
      toast.success('Profile updated!');
      setEditing(false);
    }
    catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword.length < 8) { toast.error('Min 8 characters'); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try { await usersApi.updateProfile({ password: passwordForm.newPassword } as any); toast.success('Password changed!'); setChangingPassword(false); }
    catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  if (!user) return <DashboardLayout><div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-brand-400" /></div></DashboardLayout>;

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">My Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your personal information & settings</p>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="glass-card px-5 py-2.5 text-sm text-slate-400 hover:text-white flex items-center gap-2">
                <X size={16} /> Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center">
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white text-4xl font-bold shadow-brand mx-auto">
                  {initials}
                </div>
                <button className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-lg">
                  <Camera size={14} />
                </button>
              </div>
              <h2 className="font-display font-bold text-white text-xl mt-4">{user.firstName} {user.lastName}</h2>
              <p className="text-slate-400 text-sm">{user.email}</p>
              <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                user.role === 'SUPER_ADMIN' ? 'bg-red-500/15 text-red-400' : user.role === 'ADMIN' ? 'bg-violet-500/15 text-violet-400' : user.role === 'BUSINESS_OWNER' ? 'bg-blue-500/15 text-blue-400' : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                <Shield size={12} /> {user.role?.replace(/_/g, ' ')}
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5 space-y-3">
              <h3 className="font-semibold text-white text-sm">Account Info</h3>
              {[
                { icon: Calendar, label: 'Member Since', value: user.createdAt ? formatDate(user.createdAt) : 'N/A' },
                { icon: Shield, label: 'KYC Status', value: user.kycStatus || 'PENDING', color: user.kycStatus === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2 text-slate-400 text-sm"><item.icon size={14} />{item.label}</div>
                  <span className={`text-sm font-medium ${item.color || 'text-white'}`}>{item.value}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 space-y-2">
              <h3 className="font-semibold text-white text-sm mb-3">Quick Links</h3>
              {[
                { icon: Wallet, label: 'My Wallet', href: '/wallet' },
                { icon: TrendingUp, label: 'My Investments', href: '/investments' },
                { icon: Shield, label: 'KYC Verification', href: '/kyc' },
              ].map((link, i) => (
                <Link key={i} href={link.href} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all text-sm">
                  <link.icon size={16} className="text-brand-400" />{link.label}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right Column — Personal Info Form */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-6">
              <h3 className="font-display font-semibold text-white text-lg mb-6">Personal Information</h3>
              
              <div className="space-y-5">
                {/* Row 1: First + Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">First Name</label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                        <User size={17} className="text-slate-500" />
                      </div>
                      <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})}
                        disabled={!editing} placeholder="John"
                        className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-500/50 transition-all disabled:opacity-50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Last Name</label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                        <User size={17} className="text-slate-500" />
                      </div>
                      <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})}
                        disabled={!editing} placeholder="Doe"
                        className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-500/50 transition-all disabled:opacity-50" />
                    </div>
                  </div>
                </div>

                {/* Email (disabled) */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                      <Mail size={17} className="text-slate-500" />
                    </div>
                    <input type="email" value={form.email} disabled
                      className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-500 placeholder-slate-600 outline-none disabled:opacity-50 cursor-not-allowed" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                </div>

                {/* Phone + Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                        <Phone size={17} className="text-slate-500" />
                      </div>
                      <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                        disabled={!editing} placeholder="+91 98765 43210"
                        className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-500/50 transition-all disabled:opacity-50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Location</label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                        <MapPin size={17} className="text-slate-500" />
                      </div>
                      <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                        disabled={!editing} placeholder="City, State"
                        className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-500/50 transition-all disabled:opacity-50" />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Bio</label>
                  <div className="relative">
                    <div className="absolute left-0 top-3 w-10 flex items-start justify-center">
                      <FileText size={17} className="text-slate-500" />
                    </div>
                    <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                      disabled={!editing} rows={3} placeholder="Tell us about yourself..."
                      className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-500/50 transition-all resize-none disabled:opacity-50" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white text-lg">Security</h3>
                {!changingPassword && (
                  <button onClick={() => setChangingPassword(true)} className="text-sm text-brand-400 hover:text-brand-300">
                    Change Password
                  </button>
                )}
              </div>
              {changingPassword ? (
                <div className="space-y-3">
                  {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                    <div key={field}>
                      <label className="text-xs text-slate-400 mb-1 block">
                        {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
                      </label>
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center">
                          <Key size={16} className="text-slate-500" />
                        </div>
                        <input type={showPasswords ? 'text' : 'password'}
                          value={passwordForm[field as keyof typeof passwordForm]}
                          onChange={e => setPasswordForm({...passwordForm, [field]: e.target.value})}
                          placeholder="••••••••"
                          className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-brand-500/50 transition-all" />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setShowPasswords(!showPasswords)} className="text-xs text-slate-400 flex items-center gap-1">
                    {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />} {showPasswords ? 'Hide' : 'Show'} passwords
                  </button>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setChangingPassword(false)} className="glass-card px-4 py-2 text-sm text-slate-400">Cancel</button>
                    <button onClick={handlePasswordChange} disabled={saving} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Update Password
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                  <Key size={18} className="text-slate-500" />
                  <p className="text-sm text-slate-300">Password</p>
                  <p className="text-xs text-slate-500">••••••••••••</p>
                  <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">Protected</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
