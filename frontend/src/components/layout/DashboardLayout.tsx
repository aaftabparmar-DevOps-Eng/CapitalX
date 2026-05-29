'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import {
  LayoutDashboard, Building2, TrendingUp, Wallet, User, Shield,
  Bell, LogOut, Menu, X, ChevronRight, Activity, MessageSquare,
  FileCheck, BarChart3, Globe, Sparkles, ChevronLeft
} from 'lucide-react';

const investorNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
  { href: '/investments', label: 'Investments', icon: TrendingUp },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/kyc', label: 'KYC', icon: FileCheck },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/contact', label: 'Contact', icon: MessageSquare },
];

const businessNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/kyc', label: 'KYC', icon: FileCheck },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/contact', label: 'Contact', icon: MessageSquare },
];

const adminNav = [
  { href: '/admin', label: 'Admin Panel', icon: Shield },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (!isAuthenticated || !user) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <Activity className="w-10 h-10 text-brand-500 animate-pulse" />
    </div>
  );

  const navItems = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? adminNav
    : user.role === 'BUSINESS_OWNER' ? businessNav
    : investorNav;

  const handleLogout = async () => { await logout(); router.push('/login'); };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col glass-card rounded-none border-r border-white/8 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative
        ${collapsed ? 'w-20' : 'w-64'}`}>
        
        {/* Logo */}
        <div className={`flex items-center border-b border-white/8 p-4 ${collapsed ? 'justify-center' : 'gap-3 px-5'}`}>
          <Link href="/dashboard" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
              <Sparkles size={20} className="text-white" />
            </div>
            {!collapsed && (
              <div>
                <span className="font-display font-bold text-lg gradient-text">CapitalX</span>
                <p className="text-[10px] text-slate-500 -mt-0.5 capitalize">{user.role?.replace(/_/g, ' ').toLowerCase()}</p>
              </div>
            )}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all ml-auto">
            <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) || (item.href === '/admin' && pathname.startsWith('/admin'));
            return (
              <Link key={item.href} href={item.href} className="block">
                <motion.div whileHover={{ x: collapsed ? 0 : 3 }} whileTap={{ scale: 0.97 }}
                  className={`flex items-center rounded-xl transition-all duration-200 group relative
                    ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'}
                    ${isActive ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span className="font-medium text-sm truncate">{item.label}</span>}
                  {!collapsed && isActive && <ChevronRight size={14} className="ml-auto opacity-70 flex-shrink-0" />}
                  {collapsed && isActive && <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-brand-400" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className={`border-t border-white/8 ${collapsed ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center mb-2 ${collapsed ? 'justify-center' : 'gap-3 px-2'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-brand-500/20">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout}
            className={`w-full flex items-center rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-sm
              ${collapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'}`}>
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-white/8 bg-surface/80 backdrop-blur-xl">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Menu size={22} />
          </button>
          
          {/* Breadcrumb */}
          <div className="hidden sm:block flex-1">
            <p className="text-sm font-medium text-white capitalize">
              {pathname.split('/').filter(Boolean).join(' › ') || 'Dashboard'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-400" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
