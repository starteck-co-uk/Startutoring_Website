'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StarField from '@/components/StarField';
import GlassCard from '@/components/GlassCard';

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supaOk, setSupaOk] = useState<boolean>(true);

  useEffect(() => {
    // best-effort — we just check env var presence via a HEAD call
    fetch('/api/auth/login', { method: 'GET' })
      .then((r) => r.json())
      .then((j) => setSupaOk(!!j.supabase))
      .catch(() => setSupaOk(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), pin: pin.trim() })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Login failed');
      localStorage.setItem('star_user', JSON.stringify(j.user));
      router.push('/portal/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (e: string) => {
    setEmail(e);
    setPin('1234');
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden py-12">
      <StarField count={18} />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div
            className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl font-bold text-[#1a1304] animate-pulseGold"
            style={{
              background: 'linear-gradient(135deg, #ffd166 0%, #f5b72f 100%)',
              boxShadow: '0 20px 60px -15px rgba(245,183,47,0.8)'
            }}
          >
            ★
          </div>
          <h1 className="font-serif text-4xl font-semibold text-gradient mt-5">Star Tutoring</h1>
          <p className="text-xs tracking-[0.3em] text-ink-muted mt-1 uppercase">Student Portal</p>
        </div>

        {!supaOk && (
          <div className="glass p-4 mb-5 border-l-4 border-warn text-sm text-ink-soft">
            ⚠ Supabase not configured — running in demo mode with local accounts.
          </div>
        )}

        <GlassCard className="!p-8" hover={false}>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="field-label">Email Address</label>
              <input
                type="email"
                required
                className="field"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">PIN</label>
              <input
                type="password"
                required
                inputMode="numeric"
                className="field tracking-[0.5em] text-center text-lg"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
              />
            </div>
            {error && (
              <div className="p-3 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-gold w-full justify-center disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#1a1304] border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In →</>
              )}
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-white/5">
            <p className="text-xs text-ink-muted uppercase tracking-widest mb-3 text-center">
              Demo Accounts
            </p>
            <div className="space-y-2 text-xs">
              {[
                ['amara@test.com', 'Student'],
                ['oliver@test.com', 'Student'],
                ['parent@test.com', 'Parent']
              ].map(([e, r]) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => fillDemo(e)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-gold/30 transition"
                >
                  <span className="text-ink">{e}</span>
                  <span className="text-ink-muted">PIN: 1234 • {r}</span>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-ink-muted hover:text-gold transition">
            ← Back to Star Tutoring
          </Link>
        </div>
      </div>
    </main>
  );
}
