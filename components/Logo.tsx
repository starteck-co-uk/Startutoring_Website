import Link from 'next/link';
import { Star } from 'lucide-react';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sq = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const iconSz = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  const txt = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl';
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div
        className={`${sq} rounded-[12px] flex items-center justify-center text-[#1a1304] transition-all duration-300 group-hover:scale-110`}
        style={{
          background: 'linear-gradient(135deg, #ffd166 0%, #f5b72f 100%)',
          boxShadow: '0 6px 20px -4px rgba(245,183,47,0.5), inset 0 1px 0 rgba(255,255,255,0.35)'
        }}
      >
        <Star className={`${iconSz} fill-[#1a1304]`} />
      </div>
      <span className={`font-serif font-semibold ${txt} text-gradient tracking-tight`}>
        Star Tutoring
      </span>
    </Link>
  );
}
