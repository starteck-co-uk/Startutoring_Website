import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-gradient mb-4">404</h1>
        <p className="text-ink-soft text-lg mb-6">Page not found</p>
        <Link href="/" className="btn btn-gold">
          Go Home
        </Link>
      </div>
    </div>
  );
}
