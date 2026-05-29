'use client';
import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
] as const;

export type Language = typeof LANGUAGES[number]['code'];

export function getStoredLang(): Language {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('capitalx-lang') as Language) || 'en';
}

export function LanguageSwitcher() {
  const [current, setCurrent] = useState<Language>('en');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCurrent(getStoredLang());
  }, []);

  const switchLang = (code: Language) => {
    localStorage.setItem('capitalx-lang', code);
    setCurrent(code);
    setOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
        <Globe size={16} />
        <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === current)?.label || 'English'}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 glass-card p-2 z-50 min-w-[140px]">
          {LANGUAGES.map(lang => (
            <button key={lang.code} onClick={() => switchLang(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                current === lang.code ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <span>{lang.flag}</span> {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
