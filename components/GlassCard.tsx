import { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padded?: boolean;
}

export default function GlassCard({
  children,
  hover = true,
  padded = true,
  className = '',
  ...rest
}: Props) {
  return (
    <div
      className={`glass ${hover ? 'glass-hover' : ''} ${padded ? 'p-7' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
