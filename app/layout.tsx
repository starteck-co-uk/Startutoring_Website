import type { Metadata } from 'next';
import { Fraunces, Outfit } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-fraunces',
  display: 'swap'
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Star Tutoring — Better Grades, Better Future | Stretford, Manchester',
  description:
    'Premium tutoring in Stretford, Manchester. 10+ years experience, DBS-checked tutors, interactive tools and personalised support for 11+, KS2, KS3, GCSE, A-Level and Degree-level students.',
  keywords: [
    'tutoring Manchester',
    'Stretford tutors',
    '11+ preparation',
    'GCSE tutoring',
    'A-Level tutors',
    'Maths English Science'
  ],
  openGraph: {
    title: 'Star Tutoring — Better Grades, Better Future',
    description:
      'Premium, personalised tutoring for every level. Book a free assessment today.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="bg-mesh">
          <div className="blob blob-gold" />
          <div className="blob blob-blue" />
          <div className="blob blob-pink" />
        </div>
        <div className="bg-grid" />
        <div className="bg-noise" />
        {children}
      </body>
    </html>
  );
}
