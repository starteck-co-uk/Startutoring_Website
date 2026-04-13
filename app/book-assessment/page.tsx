'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';

const subjectOptions = [
  'Maths',
  'Chemistry',
  'Biology',
  'English',
  'Physics',
  'Verbal Reasoning',
  'Non-Verbal Reasoning'
];

export default function BookAssessmentPage() {
  const [form, setForm] = useState({
    learner_name: '',
    academic_year: '',
    parent_name: '',
    school_name: '',
    course: '11+',
    subjects: [] as string[],
    good_at: '',
    improve: '',
    other_info: '',
    medical: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSubject = (s: string) => {
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(s) ? f.subjects.filter((x) => x !== s) : [...f.subjects, s]
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/book-assessment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form)
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Something went wrong');
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
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
              <span className="eyebrow">Free, No Obligation</span>
              <h1 className="text-5xl md:text-7xl font-semibold text-gradient">
                Book Your Free Assessment
              </h1>
              <p className="text-ink-soft max-w-2xl mx-auto mt-6 text-lg">
                Tell us a little about your child and we'll schedule a friendly, no-pressure
                assessment to understand their needs.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section !pt-0">
          <div className="container-xl">
            <Reveal stagger className="grid md:grid-cols-3 gap-5 mb-12">
              {[
                {
                  icon: '🏫',
                  title: '11+ / Grammar School',
                  desc: 'Full preparation with mock tests, technique training and weekly practice papers.'
                },
                {
                  icon: '📚',
                  title: 'Primary School',
                  desc: 'Daily worksheets and personalised support covering all core KS1 & KS2 topics.'
                },
                {
                  icon: '🎯',
                  title: 'Secondary & GCSE',
                  desc: 'Targeted GCSE revision, past-paper practice and exam technique mastery.'
                }
              ].map((c) => (
                <GlassCard key={c.title} className="!p-7">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gold-dim border border-gold/30">
                    {c.icon}
                  </div>
                  <h3 className="font-serif text-xl font-semibold">{c.title}</h3>
                  <p className="text-ink-soft text-sm mt-2 leading-relaxed">{c.desc}</p>
                </GlassCard>
              ))}
            </Reveal>

            <Reveal>
              <GlassCard className="!p-8 md:!p-12 max-w-4xl mx-auto">
                {done ? (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl bg-gold-dim border border-gold/40 text-gold mb-6">
                      ✓
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gradient">
                      Thank you!
                    </h2>
                    <p className="text-ink-soft mt-4 max-w-md mx-auto">
                      Your assessment request has been received. Our team will be in touch within
                      24 hours to arrange a convenient time.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="field-label">Learner's Name</label>
                        <input
                          required
                          className="field"
                          value={form.learner_name}
                          onChange={(e) => setForm({ ...form, learner_name: e.target.value })}
                          placeholder="e.g. Amara Patel"
                        />
                      </div>
                      <div>
                        <label className="field-label">Current Academic Year</label>
                        <input
                          required
                          className="field"
                          value={form.academic_year}
                          onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                          placeholder="e.g. Year 6"
                        />
                      </div>
                      <div>
                        <label className="field-label">Parent / Guardian Name</label>
                        <input
                          required
                          className="field"
                          value={form.parent_name}
                          onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="field-label">School Name</label>
                        <input
                          required
                          className="field"
                          value={form.school_name}
                          onChange={(e) => setForm({ ...form, school_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="field-label">Course</label>
                        <select
                          className="field"
                          value={form.course}
                          onChange={(e) => setForm({ ...form, course: e.target.value })}
                        >
                          {['11+', 'KS2', 'KS3', 'GCSE', 'A-Level'].map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="field-label">Phone Number</label>
                        <input
                          required
                          type="tel"
                          className="field"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="01615664995"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="field-label">Subjects</label>
                      <div className="flex flex-wrap gap-2">
                        {subjectOptions.map((s) => {
                          const on = form.subjects.includes(s);
                          return (
                            <label
                              key={s}
                              className={`checkbox-pill ${on ? 'on' : ''}`}
                            >
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={on}
                                onChange={() => toggleSubject(s)}
                              />
                              <span>{s}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="field-label">Things I'm good at</label>
                        <textarea
                          className="field"
                          value={form.good_at}
                          onChange={(e) => setForm({ ...form, good_at: e.target.value })}
                          placeholder="Strengths, favourite topics..."
                        />
                      </div>
                      <div>
                        <label className="field-label">Things I want to improve</label>
                        <textarea
                          className="field"
                          value={form.improve}
                          onChange={(e) => setForm({ ...form, improve: e.target.value })}
                          placeholder="Challenging areas..."
                        />
                      </div>
                      <div>
                        <label className="field-label">Other useful information</label>
                        <textarea
                          className="field"
                          value={form.other_info}
                          onChange={(e) => setForm({ ...form, other_info: e.target.value })}
                          placeholder="Exam dates, learning preferences..."
                        />
                      </div>
                      <div>
                        <label className="field-label">Medical conditions tutor should know</label>
                        <textarea
                          className="field"
                          value={form.medical}
                          onChange={(e) => setForm({ ...form, medical: e.target.value })}
                          placeholder="Allergies, SEN needs, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="field-label">Email Address</label>
                      <input
                        required
                        type="email"
                        className="field"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@email.com"
                      />
                    </div>

                    {error && (
                      <div className="p-4 rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-gold w-full justify-center text-base disabled:opacity-60"
                    >
                      {loading ? 'Submitting...' : 'Book Now →'}
                    </button>
                  </form>
                )}
              </GlassCard>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
