'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'admin';
  grade?: string;
  avatar?: string;
}

const nav = [
  { href: '/portal/dashboard', icon: '📝', label: 'Quizzes' },
  { href: '/portal/dashboard/analytics', icon: '📊', label: 'Analytics' }
];

export default function Sidebar({ user }: { user: PortalUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const logout = () => {
    localStorage.removeItem('star_user');
    router.push('/portal/login');
  };

  return (
    <>
      {/* desktop */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col py-6 px-3 bg-[rgba(11,18,34,0.85)] backdrop-blur-xl border-r border-white/5 transition-all duration-300"
        style={{ width: expanded ? 220 : 72 }}
      >
        <div className="flex items-center gap-3 px-2 mb-8">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold text-[#1a1304] flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #ffd166, #f5b72f)' }}
          >
            ★
          </div>
          {expanded && (
            <span className="font-serif text-lg font-semibold text-gradient whitespace-nowrap">
              Star
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((n) => {
            const active =
              pathname === n.href ||
              (n.href === '/portal/dashboard' && pathname === '/portal/dashboard');
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  active
                    ? 'bg-gold-dim border border-gold/30 text-gold-light'
                    : 'text-ink-soft hover:bg-white/5'
                }`}
              >
                <span className="text-xl flex-shrink-0 w-6 text-center">{n.icon}</span>
                {expanded && <span className="text-sm font-medium whitespace-nowrap">{n.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 pt-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #f5b72f, #ffd166)', color: '#1a1304' }}
            >
              {user.name[0]}
            </div>
            {expanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-ink-muted truncate">{user.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-soft hover:bg-red-500/10 hover:text-red-300 transition text-sm"
          >
            <span className="text-lg w-6 text-center">⎋</span>
            {expanded && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[rgba(11,18,34,0.9)] backdrop-blur-xl border-t border-white/5 flex justify-around py-2">
        {nav.map((n) => {
          const active = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg text-xs ${
                active ? 'text-gold' : 'text-ink-soft'
              }`}
            >
              <span className="text-lg">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
        <button onClick={logout} className="flex flex-col items-center gap-1 px-4 py-2 text-xs text-ink-soft">
          <span className="text-lg">⎋</span>
          Logout
        </button>
      </nav>
    </>
  );
}

export function usePortalUser(): PortalUser | null {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem('star_user');
    if (!raw) {
      router.replace('/portal/login');
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch {
      router.replace('/portal/login');
    }
  }, [router]);
  return user;
}
