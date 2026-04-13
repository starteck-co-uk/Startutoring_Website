import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <section className="section !pt-10">
          <div className="container-xl text-center">
            <Reveal>
              <span className="eyebrow">Who We Are</span>
              <h1 className="text-5xl md:text-7xl font-semibold text-gradient">
                About Star Tutoring
              </h1>
              <p className="text-ink-soft max-w-2xl mx-auto mt-6 text-lg">
                A decade of helping students achieve their academic dreams, right in the heart of
                Stretford.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section !pt-0">
          <div className="container-xl grid lg:grid-cols-2 gap-10 items-start">
            <Reveal>
              <GlassCard className="!p-10">
                <span className="eyebrow">Our Story</span>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold mt-3">
                  A decade of teaching excellence
                </h2>
                <div className="space-y-4 mt-6 text-ink-soft leading-relaxed">
                  <p>
                    Star Tutoring was founded by a director with degrees in{' '}
                    <span className="text-ink">Electronics Engineering</span>,{' '}
                    <span className="text-ink">International Business Management</span>, and{' '}
                    <span className="text-ink">Educational Leadership</span> — alongside multiple
                    teaching and assessment qualifications.
                  </p>
                  <p>
                    With <span className="text-gold">10+ years</span> of experience across further
                    and higher education, our centre teaches the full British National Curriculum,
                    from primary school fundamentals to university-level courses.
                  </p>
                  <p>
                    Based on the 1st Floor at 2 Urmston Lane, Stretford, we offer both in-person
                    and online lessons. Every tutor is qualified, DBS-checked, and personally
                    committed to each student's progress.
                  </p>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal variant="right" stagger className="space-y-5">
              {[
                { k: '10+', l: 'Years of Experience' },
                { k: '500+', l: 'Students Taught' },
                { k: '100%', l: 'DBS Checked Tutors' },
                { k: '6', l: 'Key Stages Covered' }
              ].map((s) => (
                <GlassCard key={s.l} className="!p-7 flex items-center justify-between">
                  <span className="text-ink-soft">{s.l}</span>
                  <span className="font-serif text-4xl font-semibold text-gradient-gold">
                    {s.k}
                  </span>
                </GlassCard>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container-xl">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow">Our Approach</span>
              <h2 className="text-4xl md:text-5xl font-semibold text-gradient">
                Teaching, the right way
              </h2>
              <p className="text-ink-soft mt-4">
                We believe every child learns differently. Our tutors adapt to your child's pace,
                interests and learning style — making every lesson engaging and effective.
              </p>
            </Reveal>

            <Reveal stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '∑', name: 'Maths', desc: 'From arithmetic to calculus — build confidence step by step.' },
                { icon: '📖', name: 'English', desc: 'Comprehension, writing, grammar and literature.' },
                { icon: '⚡', name: 'Science', desc: 'Physics, Chemistry and Biology made accessible.' },
                { icon: '✎', name: '11+ Prep', desc: 'Grammar school success through structured practice.' }
              ].map((s) => (
                <GlassCard key={s.name} className="!p-7">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gold-dim border border-gold/30 text-gold">
                    {s.icon}
                  </div>
                  <h3 className="font-serif text-xl font-semibold">{s.name}</h3>
                  <p className="text-ink-soft text-sm mt-2 leading-relaxed">{s.desc}</p>
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
