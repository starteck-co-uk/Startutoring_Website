'use client';

import { useEffect, useState } from 'react';

export default function StarField({ count = 15 }: { count?: number }) {
  const [stars, setStars] = useState<
    { left: string; size: string; duration: string; delay: string }[]
  >([]);

  useEffect(() => {
    const next = Array.from({ length: count }).map(() => ({
      left: `${Math.random() * 100}%`,
      size: `${10 + Math.random() * 18}px`,
      duration: `${12 + Math.random() * 10}s`,
      delay: `${-Math.random() * 15}s`
    }));
    setStars(next);
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="star-particle"
          style={{
            left: s.left,
            fontSize: s.size,
            animationDuration: s.duration,
            animationDelay: s.delay
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
