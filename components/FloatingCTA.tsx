'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, X } from 'lucide-react';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="floating-cta">
      <div className="relative">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0c1224] border border-white/10 flex items-center justify-center text-ink-muted hover:text-white transition-colors z-10"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
        <Link
          href="/book-assessment"
          className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-[#1a1304] font-semibold shadow-[0_8px_30px_-5px_rgba(245,183,47,0.5)] hover:scale-105 transition-transform"
        >
          <Phone className="w-4 h-4" />
          <span className="text-sm">Book Free Assessment</span>
        </Link>
      </div>
    </div>
  );
}
