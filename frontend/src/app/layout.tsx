import type { Metadata } from 'next';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'CapitalX — Verified Business Investment Platform',
  description: 'Invest in verified businesses with AI-powered risk scoring, escrow protection, and real-time portfolio tracking.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a2235', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#10b981', secondary: '#1a2235' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#1a2235' } },
        }} />
      </body>
    </html>
  );
}
