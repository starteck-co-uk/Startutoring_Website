'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-5xl font-bold text-gradient mb-4">Something went wrong</h1>
        <p className="text-ink-soft text-lg mb-6">An unexpected error occurred.</p>
        <button onClick={reset} className="btn btn-gold">
          Try Again
        </button>
      </div>
    </div>
  );
}
