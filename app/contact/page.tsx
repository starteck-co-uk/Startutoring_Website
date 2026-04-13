'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form)
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Something went wrong');
      setDone(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="section !pt-10">
          <div className="container-xl text-center">
            <Reveal>
              <span className="eyebrow">Say Hello</span>
              <h1 className="text-5xl md:text-7xl font-semibold text-gradient">Contact Us</h1>
              <p className="text-ink-soft max-w-2xl mx-auto mt-6 text-lg">
                Questions? Ready to enrol? Drop us a message or visit us in Stretford.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section !pt-0">
          <div className="container-xl grid lg:grid-cols-2 gap-8">
            <Reveal>
              <GlassCard className="!p-10">
                <h2 className="font-serif text-3xl font-semibold text-gradient">Get In Touch</h2>
                <p className="text-ink-soft mt-3 text-sm">
                  We usually reply within a few hours during office times.
                </p>

                {done && (
                  <div className="mt-6 p-4 rounded-xl border border-gold/30 bg-gold-dim text-gold-light text-sm">
                    ✓ Message received. We'll be in touch shortly.
                  </div>
                )}

                <form onSubmit={submit} className="space-y-5 mt-8">
                  <div>
                    <label className="field-label">Your Name</label>
                    <input
                      required
                      className="field"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="field-label">Email</label>
                    <input
                      required
                      type="email"
                      className="field"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="field-label">Message</label>
                    <textarea
                      required
                      rows={5}
                      className="field"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
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
                    {loading ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              </GlassCard>
            </Reveal>

            <Reveal variant="right" stagger className="space-y-5">
              <GlassCard className="!p-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-gold-dim border border-gold/30 flex items-center justify-center text-xl">
                    📍
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold">Visit Us</h3>
                    <p className="text-ink-soft text-sm mt-1">
                      1st Floor, 2 Urmston Lane
                      <br />
                      Stretford, M32 9BP
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="!p-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-gold-dim border border-gold/30 flex items-center justify-center text-xl">
                    📞
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold">Call Us</h3>
                    <a
                      href="tel:01615664995"
                      className="text-ink-soft text-sm mt-1 block hover:text-gold transition"
                    >
                      01615664995
                    </a>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="!p-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl bg-gold-dim border border-gold/30 flex items-center justify-center text-xl">
                    ✉
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold">Email Us</h3>
                    <a
                      href="mailto:info@startutoring.uk"
                      className="text-ink-soft text-sm mt-1 block hover:text-gold transition"
                    >
                      info@startutoring.uk
                    </a>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="!p-0 overflow-hidden" hover={false}>
                <iframe
                  title="Star Tutoring location"
                  src="https://www.google.com/maps?q=2+Urmston+Lane,+Stretford,+M32+9BP&output=embed"
                  className="w-full h-[260px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </GlassCard>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
