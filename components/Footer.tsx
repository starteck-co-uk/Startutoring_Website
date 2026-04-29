import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative px-5 pb-8 pt-20">
      <div className="container-xl">
        <div className="glass-glow p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo />
            <p className="text-ink-soft text-sm mt-4 leading-relaxed">
              Premium tutoring in the heart of Stretford. Better grades, better future — powered by
              dedicated educators and interactive tools.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { s: 'f', label: 'Facebook' },
                { s: 'in', label: 'LinkedIn' },
                { s: 'ig', label: 'Instagram' },
                { s: 'yt', label: 'YouTube' }
              ].map(({ s, label }) => (
                <a
                  key={s}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/8 flex items-center justify-center text-xs text-ink-soft hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition-all duration-300"
                  aria-label={label}
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
            <ul className="space-y-2.5 text-ink-soft text-sm">
              <li><Link href="/" className="hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors duration-200">Courses</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-200">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors duration-200">Contact</Link></li>
              <li><Link href="/portal/login" className="hover:text-white transition-colors duration-200">Student Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-widest text-gold mb-4 font-sans font-semibold">
              Subjects
            </h4>
            <ul className="space-y-2.5 text-ink-soft text-sm">
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
              <li className="flex gap-2.5">
                <span className="text-gold">📍</span>
                <span>1st Floor, 2 Urmston Lane,<br/>Stretford, Manchester, M32 9BP</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-gold">📞</span>
                <a href="tel:+447828186831" className="hover:text-white transition-colors duration-200">+44 7828 186831</a>
              </li>
              <li className="flex gap-2.5">
                <span className="text-gold">✉</span>
                <a href="mailto:info@startutoring.uk" className="hover:text-white transition-colors duration-200">info@startutoring.uk</a>
              </li>
            </ul>
            <div className="mt-4 rounded-xl overflow-hidden border border-white/5">
              <iframe
                title="Star Tutoring location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2376.267885614492!2d-2.3141703000000002!3d53.4457974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bad9c659bd00b%3A0xa8b5592d7ca3296f!2sStar%20Tutoring!5e0!3m2!1sen!2sin!4v1777360296523!5m2!1sen!2sin"
                className="w-full h-[150px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
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
