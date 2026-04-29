import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';

export const metadata: Metadata = {
  title: 'Courses — 11+, KS2, KS3, GCSE, A-Level Tutoring',
  description:
    'Expert tutoring courses in Stretford, Manchester. 11+ preparation with mock exams, KS2 & KS3 foundations, GCSE guaranteed grade improvement, A-Level sciences and Maths. Affordable rates, DBS-checked tutors.',
  alternates: { canonical: 'https://startutoring.uk/courses' }
};

const courses = [
  {
    id: '11plus',
    badge: 'Complete Preparation',
    title: '11+ Preparation',
    icon: '✎',
    grad: 'linear-gradient(135deg, #f5b72f, #ffd166)',
    subjects: ['Maths', 'English', 'Verbal Reasoning', 'Non-Verbal Reasoning'],
    feature: 'Full mock exam practice with detailed feedback after every test.',
    desc: 'A structured programme designed to get your child grammar-school ready — from foundation skills to exam-day confidence.'
  },
  {
    id: 'ks2-3',
    badge: 'Build Strong Foundations',
    title: 'KS2 & KS3',
    icon: '★',
    grad: 'linear-gradient(135deg, #a78bfa, #6366f1)',
    subjects: ['Maths', 'English', 'Physics', 'Chemistry', 'Biology'],
    feature: 'Daily worksheets, weekly homework and fortnightly mock tests.',
    desc: 'Strengthen every core subject with weekly lessons and ongoing assessments that build confidence for GCSE.'
  },
  {
    id: 'gcse',
    badge: 'Guaranteed Grade Improvement',
    title: 'GCSE',
    icon: '◉',
    grad: 'linear-gradient(135deg, #34d399, #10b981)',
    subjects: ['Maths', 'Physics', 'Chemistry', 'Biology', 'English'],
    feature: 'Past-paper mastery and exam technique training.',
    desc: 'Targeted revision covering every exam board. Proven methods, focused practice and guaranteed grade improvement.'
  },
  {
    id: 'alevel',
    badge: 'University Ready',
    title: 'A-Level',
    icon: '▲',
    grad: 'linear-gradient(135deg, #ec4899, #f472b6)',
    subjects: ['Maths', 'Physics', 'Chemistry', 'Biology'],
    feature: 'UCAS support and personalised university prep included.',
    desc: 'Intensive, specialist tuition for A-Level sciences and maths — preparing you for the best universities.'
  }
];

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="section !pt-10">
          <div className="container-xl text-center">
            <Reveal>
              <span className="eyebrow">Our Programmes</span>
              <h1 className="text-5xl md:text-7xl font-semibold text-gradient">Our Courses</h1>
              <p className="text-ink-soft max-w-2xl mx-auto mt-6 text-lg">
                Structured, level-specific programmes built around the British National Curriculum.
                Pick a tier and start thriving.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section !pt-0">
          <div className="container-xl">
            <Reveal stagger className="grid md:grid-cols-2 gap-7">
              {courses.map((c) => (
                <GlassCard key={c.id} className="!p-9 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white"
                      style={{ background: c.grad, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.6)' }}
                    >
                      {c.icon}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-gold-dim border border-gold/30 text-gold-light font-semibold">
                      {c.badge}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl font-semibold">{c.title}</h2>
                  <p className="text-ink-soft text-sm mt-3 leading-relaxed">{c.desc}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {c.subjects.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-ink"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-gold-dim border border-gold/20 flex items-start gap-3">
                    <span className="text-gold text-lg">★</span>
                    <p className="text-sm text-ink">{c.feature}</p>
                  </div>

                  <Link href="/book-assessment" className="btn btn-gold mt-7 self-start">
                    Enquire Now →
                  </Link>
                </GlassCard>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container-xl">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow">Our Promise</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gradient">Why Our Courses</h2>
            </Reveal>

            <Reveal stagger className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '💷', title: 'Affordable & Accessible', desc: 'Budget-friendly pricing with no hidden fees. Flexible payment plans available.' },
                { icon: '🎓', title: 'Expert, Trusted Educators', desc: 'Qualified, DBS-checked teachers with 10+ years of classroom experience.' },
                { icon: '📅', title: 'Flexible Schedule', desc: 'Online or in-person sessions at times that work for your family.' }
              ].map((v) => (
                <GlassCard key={v.title} className="!p-8">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 bg-gold-dim border border-gold/30">
                    {v.icon}
                  </div>
                  <h3 className="font-serif text-xl font-semibold">{v.title}</h3>
                  <p className="text-ink-soft text-sm mt-3 leading-relaxed">{v.desc}</p>
                </GlassCard>
              ))}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
