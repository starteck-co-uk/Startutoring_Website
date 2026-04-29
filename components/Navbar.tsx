'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

const links = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/book-assessment', label: 'Book Assessment' },
  { href: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2.5' : 'py-5'
      }`}
    >
      <div
        className={`container-xl flex items-center justify-between px-5 rounded-full transition-all duration-500 ${
          scrolled
            ? 'py-2 bg-[rgba(6,10,20,0.8)] backdrop-blur-2xl border border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'py-2'
        }`}
      >
        <Logo />
        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.9rem] text-ink-soft hover:text-white transition-colors duration-300 relative group"
            >
              {l.label}
              <span className="absolute left-0 right-0 -bottom-1 h-px bg-gradient-to-r from-gold to-gold-light scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
          <Link
            href="/portal/login"
            className="btn btn-gold !py-2 !px-5 text-sm"
          >
            Student Portal →
          </Link>
        </nav>
        <button
          className="lg:hidden w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-xl hover:border-gold/30 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? '×' : '☰'}
        </button>
      </div>

      {open && (
        <div className="lg:hidden mx-4 mt-3 glass p-6 space-y-3 animate-fadeUp">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-lg text-ink-soft hover:text-white py-1.5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/portal/login"
            onClick={() => setOpen(false)}
            className="btn btn-gold w-full justify-center mt-3"
          >
            Student Portal →
          </Link>
        </div>
      )}
    </header>
  );
}
