import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Free Assessment — Star Tutoring Stretford',
  description:
    'Book a free, no-obligation assessment for your child at Star Tutoring in Stretford, Manchester. We evaluate current levels and create a personalised learning plan for 11+, KS2, KS3, GCSE, and A-Level students.',
  alternates: { canonical: 'https://startutoring.uk/book-assessment' }
};

export default function BookAssessmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
