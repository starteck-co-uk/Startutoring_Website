import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative px-5 pb-8 pt-20">
      <div className="container-xl">
        <div className="glass p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo />
            <p className="text-ink-soft text-sm mt-4 leading-relaxed">
              Premium tutoring in the heart of Stretford. Better grades, better future — powered by
              dedicated educators and interactive tools.
            </p>
            <div className="flex gap-3 mt-5">
              {['f', 'in', 'ig', 'yt'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-xs text-ink-soft hover:text-gold hover:border-gold/50 transition-colors"
                  aria-label={s}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-gold mb-4 font-sans font-semibold">
              Quick Links
            </h4>
            <ul className="space-y-2 text-ink-soft text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/courses" className="hover:text-white transition">Courses</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/portal/login" className="hover:text-white transition">Student Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-gold mb-4 font-sans font-semibold">
              Subjects
            </h4>
            <ul className="space-y-2 text-ink-soft text-sm">
              <li>Maths</li>
              <li>Science (Physics, Chemistry, Biology)</li>
              <li>English</li>
              <li>11+ Preparation</li>
              <li>Engineering & Business</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-gold mb-4 font-sans font-semibold">
              Contact
            </h4>
            <ul className="space-y-3 text-ink-soft text-sm">
              <li className="flex gap-2">
                <span className="text-gold">📍</span>
                <span>1st Floor, 2 Urmston Lane,<br/>Stretford, M32 9BP</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gold">📞</span>
                <a href="tel:01615664995" className="hover:text-white transition">01615664995</a>
              </li>
              <li className="flex gap-2">
                <span className="text-gold">✉</span>
                <a href="mailto:info@startutoring.uk" className="hover:text-white transition">info@startutoring.uk</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-line my-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-ink-muted px-2">
          <p>© 2025 Star Tutoring. All Rights Reserved.</p>
          <p>Crafted with care in Stretford, Manchester.</p>
        </div>
      </div>
    </footer>
  );
}
