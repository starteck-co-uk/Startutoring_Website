import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Star Tutoring Stretford, Manchester',
  description:
    'Get in touch with Star Tutoring. Visit us at 1st Floor, 2 Urmston Lane, Stretford, Manchester M32 9BP. Call +44 7828 186831 or email info@startutoring.uk. Leave feedback or book a free assessment.',
  alternates: { canonical: 'https://startutoring.uk/contact' }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
