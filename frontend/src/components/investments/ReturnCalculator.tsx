'use client';
import { useState } from 'react';
import { Calculator, TrendingUp, Sparkles, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

function getTierRate(amount: number): number {
  if (amount <= 2500000) return 1;
  if (amount <= 5000000) return 1.5;
  if (amount <= 10000000) return 2;
  return 2.5;
}

function getTierLabel(amount: number): string {
  if (amount <= 2500000) return '1% (Up to ₹25L)';
  if (amount <= 5000000) return '1.5% (₹25L-50L)';
  if (amount <= 10000000) return '2% (₹50L-1Cr)';
  return '2.5% (Above ₹1Cr)';
}

export function ReturnCalculator() {
  const [amount, setAmount] = useState(50000);
  const [open, setOpen] = useState(false);

  const tierRate = getTierRate(amount);
  const monthlyReturn = (amount * tierRate) / 100;
  const yearlyReturn = monthlyReturn * 12;
  const fdReturn = (amount * 6.5) / 100;
  const extraEarning = yearlyReturn - fdReturn;
  const quickAmounts = [5000, 10000, 25000, 50000, 100000, 500000, 1000000];

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="glass-card px-4 py-2.5 flex items-center gap-2 text-sm hover:border-brand-500/30 transition-all group">
        <Calculator size={16} className="text-emerald-400" />
        <span className="text-slate-300">Invest ₹{amount.toLocaleString('en-IN')}</span>
        <span className="text-emerald-400 font-bold">= ₹{Math.round(monthlyReturn).toLocaleString('en-IN')}/mo</span>
        <span className="text-[10px] text-amber-400">+₹{Math.round(extraEarning).toLocaleString('en-IN')} vs FD</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 glass-card p-5 w-80 shadow-2xl border border-brand-500/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" /> Return Calculator
              </h3>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">
                {getTierLabel(amount)}
              </span>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-[10px] text-slate-500"><span>₹1K</span><span>₹1Cr</span></div>
              <input type="range" min="1000" max="10000000" step="1000" value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 rounded-full cursor-pointer accent-emerald-500"
                style={{background: `linear-gradient(to right, #10b981 0%, #10b981 ${((amount-1000)/(10000000-1000))*100}%, rgba(255,255,255,0.1) ${((amount-1000)/(10000000-1000))*100}%)`}} />
              <p className="text-center text-lg font-extrabold text-white">₹{amount.toLocaleString('en-IN')}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {quickAmounts.map(a => (
                <button key={a} onClick={() => setAmount(a)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${amount === a ? 'bg-brand-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                  ₹{(a/1000).toFixed(0)}K
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-emerald-500/10 rounded-lg p-2.5 text-center">
                <p className="text-[10px] text-slate-400">Monthly ({tierRate}%)</p>
                <p className="text-base font-extrabold text-emerald-400">₹{Math.round(monthlyReturn).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-brand-500/10 rounded-lg p-2.5 text-center">
                <p className="text-[10px] text-slate-400">Yearly</p>
                <p className="text-base font-extrabold text-brand-400">₹{Math.round(yearlyReturn).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="bg-amber-500/5 rounded-lg p-2.5 mb-3 text-[10px]">
              <div className="flex justify-between"><span>Bank FD (6.5%)</span><span>₹{Math.round(fdReturn).toLocaleString('en-IN')}/yr</span></div>
              <div className="flex justify-between mt-0.5"><span>CapitalX</span><span className="text-emerald-400 font-bold">₹{Math.round(yearlyReturn).toLocaleString('en-IN')}/yr</span></div>
              <div className="border-t border-amber-500/10 mt-1 pt-1 flex justify-between">
                <span className="flex items-center gap-1"><Sparkles size={10} className="text-amber-400"/>Extra</span>
                <span className="font-bold text-amber-400">+₹{Math.round(extraEarning).toLocaleString('en-IN')}/yr</span>
              </div>
            </div>

            <Link href="/businesses" onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center py-2 text-xs font-bold flex items-center gap-1.5">
              <Sparkles size={12} /> Browse Businesses <ArrowRight size={12} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
