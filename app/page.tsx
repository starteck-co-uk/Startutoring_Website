import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import StarField from '@/components/StarField';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* ============== HERO ============== */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-5">
          <StarField count={10} />
          {/* Hero ambient glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
          <div className="container-xl relative z-10 text-center">
            <Reveal>
              <span className="eyebrow">★ Trusted in Stretford for 10+ Years</span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="font-serif text-[44px] sm:text-[64px] lg:text-[86px] leading-[0.92] font-semibold mt-3 tracking-tight">
                <span className="text-gradient">Better Grades,</span>
                <br />
                <span className="text-gradient">Better Future</span>
              </h1>
            </Reveal>
            <Reveal delay={250}>
              <p className="mt-8 text-base md:text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed">
                Star Tutoring is a premium learning centre in Stretford, Manchester — offering
                personalised lessons for 11+, KS2, KS3, GCSE, A-Level and Degree-level students
                across Maths, English and Science.
              </p>
            </Reveal>
            <Reveal delay={380}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book-assessment" className="btn btn-gold text-base">
                  Book Free Assessment →
                </Link>
                <Link href="/courses" className="btn btn-ghost text-base">
                  Explore Courses
                </Link>
              </div>
            </Reveal>

            <Reveal delay={520}>
              <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                {[
                  { icon: '🎓', label: '10+ Years Experience' },
                  { icon: '🛡', label: 'DBS Checked' },
                  { icon: '📈', label: 'Guaranteed Results' }
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center gap-2.5 px-5 py-3 rounded-full glass"
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span className="text-ink-soft font-medium">{t.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-ink-muted tracking-widest flex flex-col items-center gap-1">
            <span>SCROLL</span>
            <span className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent" />
          </div>
        </section>

        {/* ============== LEVELS ============== */}
        <section className="section section-glow">
          <div className="container-xl">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow">All Key Stages</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gradient">
                Levels We Teach
              </h2>
              <p className="text-ink-soft mt-4">
                From first steps in Primary School to the final push before university — we cover
                every stage of the British curriculum.
              </p>
            </Reveal>

            <Reveal stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {[
                { name: '11+', icon: '✎', subs: 'Maths • English • Reasoning', color: '#f5b72f' },
                { name: 'KS2', icon: '★', subs: 'Core Foundations', color: '#a78bfa' },
                { name: 'KS3', icon: '◆', subs: 'Maths • English • Science', color: '#22d3ee' },
                { name: 'GCSE', icon: '◉', subs: 'All Core Subjects', color: '#34d399' },
                { name: 'A-Level', icon: '▲', subs: 'Sciences • Maths', color: '#ec4899' }
              ].map((l) => (
                <GlassCard key={l.name} className="text-center !p-7">
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4 transition-transform duration-300 hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${l.color}25, ${l.color}08)`,
                      border: `1px solid ${l.color}35`,
                      color: l.color,
                      boxShadow: `0 8px 24px -8px ${l.color}25`
                    }}
                  >
                    {l.icon}
                  </div>
                  <h3 className="font-serif text-xl font-semibold">{l.name}</h3>
                  <p className="text-xs text-ink-muted mt-2">{l.subs}</p>
                </GlassCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ============== SUBJECTS ============== */}
        <section className="section section-glow">
          <div className="container-xl">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow">Core Subjects</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gradient">
                Mastery Across the Curriculum
              </h2>
              <p className="text-ink-soft mt-4">
                Expert tuition in every core subject, from foundation through to exam mastery.
              </p>
            </Reveal>

            <Reveal stagger className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '∑',
                  name: 'Maths',
                  grad: 'linear-gradient(135deg, #a78bfa, #6366f1)',
                  glow: 'rgba(167, 139, 250, 0.2)',
                  desc: 'From times tables to calculus — build unshakeable numeric confidence and problem-solving skills.',
                  levels: '11+ • KS2 • KS3 • GCSE • A-Level • Degree'
                },
                {
                  icon: '⚡',
                  name: 'Science',
                  grad: 'linear-gradient(135deg, #ec4899, #f472b6)',
                  glow: 'rgba(236, 72, 153, 0.2)',
                  desc: 'Physics, Chemistry and Biology — interactive experiments and exam-focused revision techniques.',
                  levels: 'KS3 • GCSE • A-Level'
                },
                {
                  icon: '📖',
                  name: 'English',
                  grad: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                  glow: 'rgba(34, 211, 238, 0.2)',
                  desc: 'Reading comprehension, creative writing, grammar and literature — communicate with clarity and confidence.',
                  levels: '11+ • KS2 • KS3 • GCSE'
                }
              ].map((s) => (
                <GlassCard key={s.name} className="!p-8 flex flex-col group">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mb-6 transition-transform duration-300 group-hover:scale-105"
                    style={{ background: s.grad, boxShadow: `0 12px 32px -8px ${s.glow}` }}
                  >
                    {s.icon}
                  </div>
                  <h3 className="font-serif text-2xl font-semibold">{s.name}</h3>
                  <p className="text-ink-soft text-sm mt-3 leading-relaxed flex-1">{s.desc}</p>
                  <p className="text-xs text-ink-muted mt-5 uppercase tracking-wider">{s.levels}</p>
                  <Link
                    href="/courses"
                    className="mt-5 text-gold text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Start Learning →
                  </Link>
                </GlassCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ============== WHY ============== */}
        <section className="section section-glow">
          <div className="container-xl">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow">Why Star Tutoring</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gradient">
                Built Around Your Child
              </h2>
            </Reveal>

            <Reveal stagger className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '💷',
                  title: 'Affordable & Accessible',
                  desc: 'Budget-friendly rates without compromise. Quality tuition for every family, with flexible payment options.'
                },
                {
                  icon: '🎓',
                  title: 'Expert, Trusted Educators',
                  desc: 'Qualified, DBS-checked tutors with 10+ years of teaching experience across the full British curriculum.'
                },
                {
                  icon: '📅',
                  title: 'Flexible Schedule',
                  desc: 'Online or in-person lessons at times that suit you — including evenings and weekends.'
                }
              ].map((w) => (
                <GlassCard key={w.title} className="!p-8">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 bg-gold-dim border border-gold/25 shadow-[0_8px_20px_-8px_rgba(245,183,47,0.2)]">
                    {w.icon}
                  </div>
                  <h3 className="font-serif text-xl font-semibold">{w.title}</h3>
                  <p className="text-ink-soft text-sm mt-3 leading-relaxed">{w.desc}</p>
                </GlassCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ============== HOW IT WORKS ============== */}
        <section className="section section-glow">
          <div className="container-xl">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <span className="eyebrow">Simple Process</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gradient">How It Works</h2>
            </Reveal>

            <div className="relative">
              <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <Reveal stagger className="grid md:grid-cols-3 gap-10 relative">
                {[
                  {
                    n: 1,
                    title: 'Book a Free Assessment',
                    desc: 'We evaluate your child\'s current level and identify strengths and areas to improve.'
                  },
                  {
                    n: 2,
                    title: 'Get a Personalised Plan',
                    desc: 'Tailored curriculum and schedule matched to your child\'s goals and learning style.'
                  },
                  {
                    n: 3,
                    title: 'Watch Grades Improve',
                    desc: 'Track weekly progress on our AI-powered student portal with live analytics and quizzes.'
                  }
                ].map((s) => (
                  <div key={s.n} className="text-center group">
                    <div
                      className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-serif font-semibold relative transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #ffd166 0%, #f5b72f 100%)',
                        color: '#1a1304',
                        boxShadow: '0 0 50px rgba(245,183,47,0.35), inset 0 1px 0 rgba(255,255,255,0.3)'
                      }}
                    >
                      {s.n}
                    </div>
                    <h3 className="font-serif text-xl font-semibold mt-6">{s.title}</h3>
                    <p className="text-ink-soft text-sm mt-2 max-w-xs mx-auto">{s.desc}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============== PORTAL PROMO ============== */}
        <section className="section">
          <div className="container-xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Reveal variant="right">
                <span className="eyebrow">New: Student Portal</span>
                <h2 className="text-4xl md:text-5xl font-semibold text-gradient mt-3 leading-tight">
                  AI-Powered<br />Learning Portal
                </h2>
                <p className="text-ink-soft mt-6 leading-relaxed">
                  Every student gets free access to our dedicated portal. Take auto-generated
                  quizzes in Maths, Science and English — graded instantly, with full explanations
                  and progress analytics.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    'AI generates fresh quiz questions every time',
                    'Instant grading with detailed explanations',
                    'Live progress tracking per subject & topic',
                    'Parent dashboards for oversight'
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-ink-soft">
                      <span className="text-gold text-lg leading-none mt-0.5">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/portal/login" className="btn btn-gold mt-8">
                  Access Student Portal →
                </Link>
              </Reveal>

              <Reveal delay={220}>
                <div className="glass-glow p-8 relative overflow-hidden">
                  <div
                    className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-[80px]"
                    style={{ background: '#f5b72f' }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs text-ink-muted uppercase tracking-wider">Welcome back</p>
                        <p className="font-serif text-xl font-semibold">Amara ★</p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                        style={{ background: 'linear-gradient(135deg, #f5b72f, #ffd166)', color: '#1a1304' }}
                      >
                        A
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { l: 'Quizzes', v: '24', c: '#f5b72f' },
                        { l: 'Avg', v: '87%', c: '#34d399' },
                        { l: 'Streak', v: '12d', c: '#a78bfa' }
                      ].map((s) => (
                        <div
                          key={s.l}
                          className="rounded-xl p-3 text-center"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <p className="text-xs text-ink-muted">{s.l}</p>
                          <p className="font-serif text-xl font-semibold" style={{ color: s.c }}>{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl p-4 border border-white/6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-ink-muted uppercase tracking-wider">Score Trend</p>
                        <span className="text-xs text-ok">↑ 12%</span>
                      </div>
                      <svg viewBox="0 0 200 60" className="w-full h-16">
                        <defs>
                          <linearGradient id="trendG" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0" stopColor="#f5b72f" stopOpacity="0.5" />
                            <stop offset="1" stopColor="#f5b72f" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,45 L25,38 L50,42 L75,30 L100,28 L125,20 L150,22 L175,12 L200,10 L200,60 L0,60 Z"
                          fill="url(#trendG)"
                        />
                        <path
                          d="M0,45 L25,38 L50,42 L75,30 L100,28 L125,20 L150,22 L175,12 L200,10"
                          fill="none"
                          stroke="#f5b72f"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        {[[0,45],[25,38],[50,42],[75,30],[100,28],[125,20],[150,22],[175,12],[200,10]].map(([x,y], i) => (
                          <circle key={i} cx={x} cy={y} r="2.5" fill="#ffd166" />
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============== TESTIMONIALS ============== */}
        <section className="section section-glow">
          <div className="container-xl">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow">What Families Say</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gradient">
                Real Results, Real Stories
              </h2>
            </Reveal>

            <Reveal stagger className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote:
                    'My son went from a 4 to a 7 in GCSE Maths in just six months. The tutors at Star are patient, knowledgeable and make learning genuinely enjoyable.',
                  name: 'Sarah H.',
                  role: 'Parent • Stretford'
                },
                {
                  quote:
                    'I was so nervous about the 11+ but the weekly mock exams and detailed feedback got me into my first-choice grammar school. Thank you Star Tutoring!',
                  name: 'Olivia, 11',
                  role: 'Student'
                },
                {
                  quote:
                    'Finally an A-Level Physics tutor who actually explains the why. My grades jumped from a C to an A* and I got into my dream university.',
                  name: 'James M.',
                  role: 'Student • Manchester'
                }
              ].map((t) => (
                <GlassCard key={t.name} className="!p-8 glass-shine">
                  <div className="text-gold text-lg tracking-widest">★★★★★</div>
                  <p className="text-ink mt-4 leading-relaxed font-serif text-[17px] italic opacity-90">"{t.quote}"</p>
                  <div className="divider-line my-5" />
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-ink-muted">{t.role}</p>
                </GlassCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ============== CTA ============== */}
        <section className="section">
          <div className="container-xl">
            <Reveal>
              <div
                className="relative rounded-[28px] overflow-hidden p-10 md:p-16 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,183,47,0.95) 0%, rgba(255,209,102,0.92) 100%)',
                  boxShadow: '0 40px 80px -20px rgba(245,183,47,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
              >
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 70%, #fff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
                />
                <div className="relative">
                  <h2 className="font-serif text-4xl md:text-6xl font-semibold text-[#1a1304]">
                    Ready to boost your child's grades?
                  </h2>
                  <p className="mt-5 text-[#1a1304]/75 text-lg max-w-xl mx-auto">
                    Book a free, no-obligation assessment today and discover how Star Tutoring can
                    transform your child's learning journey.
                  </p>
                  <Link
                    href="/book-assessment"
                    className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full bg-[#0b1222] text-white font-semibold hover:scale-105 transition-transform shadow-2xl"
                  >
                    Book Your Free Assessment Today →
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
