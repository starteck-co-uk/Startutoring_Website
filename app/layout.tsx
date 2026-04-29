import type { Metadata } from 'next';
import { Fraunces, Outfit } from 'next/font/google';
import BackgroundEffects from '@/components/BackgroundEffects';
import StructuredData from '@/components/StructuredData';
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
  metadataBase: new URL('https://startutoring.uk'),
  title: {
    default: 'Star Tutoring — Private Tutors in Stretford, Manchester | 11+, GCSE, A-Level',
    template: '%s | Star Tutoring — Stretford, Manchester'
  },
  description:
    'Qualified private tutors in Stretford, Manchester. 10+ years experience, DBS-checked. Expert tuition in Maths, English, Science, Engineering & Business for 11+, KS2, KS3, GCSE, A-Level and Degree-level students. Book a free assessment today.',
  keywords: [
    'tutoring Manchester',
    'tutor Stretford',
    'private tuition Manchester',
    '11+ tutor Manchester',
    '11+ preparation Stretford',
    'GCSE tutor Manchester',
    'GCSE Maths tutor Stretford',
    'A-Level tutor Manchester',
    'Maths tutor Manchester',
    'English tutor Manchester',
    'Science tutor Manchester',
    'Physics tutor Manchester',
    'Chemistry tutor Manchester',
    'Biology tutor Manchester',
    'KS2 tutor Stretford',
    'KS3 tutor Manchester',
    'online tutoring Manchester',
    'private tutor Trafford',
    'tuition centre Stretford',
    'tuition centre Manchester',
    'tutoring near me Manchester',
    'best tutors Manchester'
  ],
  openGraph: {
    title: 'Star Tutoring — Private Tutors in Stretford, Manchester',
    description:
      'Qualified, DBS-checked tutors with 10+ years experience. Maths, English, Science, 11+, GCSE, A-Level. Book a free assessment today.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Star Tutoring',
    url: 'https://startutoring.uk'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Star Tutoring — Private Tutors in Stretford, Manchester',
    description: 'Expert tuition for 11+, GCSE, A-Level and Degree. Book a free assessment.'
  },
  alternates: {
    canonical: 'https://startutoring.uk'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
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
          <div className="blob blob-cyan" />
          <div className="aurora" />
        </div>
        <div className="bg-grid" />
        <div className="bg-noise" />
        <BackgroundEffects />
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
