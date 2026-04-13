'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  variant?: 'up' | 'right';
  stagger?: boolean;
  delay?: number;
}

export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  variant = 'up',
  stagger = false,
  delay = 0
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (delay) {
              setTimeout(() => setVisible(true), delay);
            } else {
              setVisible(true);
            }
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const base = variant === 'right' ? 'reveal-right' : 'reveal';
  const classes = `${base} ${stagger ? 'stagger' : ''} ${visible ? 'is-visible' : ''} ${className}`;

  // @ts-expect-error generic tag ref
  return <Tag ref={ref} className={classes}>{children}</Tag>;
}
