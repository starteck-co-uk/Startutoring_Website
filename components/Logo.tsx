import Link from 'next/link';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sq = size === 'sm' ? 'w-9 h-9 text-lg' : size === 'lg' ? 'w-14 h-14 text-3xl' : 'w-11 h-11 text-xl';
  const txt = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl';
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div
        className={`${sq} rounded-[12px] flex items-center justify-center font-bold text-[#1a1304] shadow-glow transition-transform group-hover:scale-105`}
        style={{
          background: 'linear-gradient(135deg, #ffd166 0%, #f5b72f 100%)',
          boxShadow: '0 8px 24px -8px rgba(245,183,47,0.55), inset 0 1px 0 rgba(255,255,255,0.4)'
        }}
      >
        ★
      </div>
      <span className={`font-serif font-semibold ${txt} text-gradient tracking-tight`}>
        Star Tutoring
      </span>
    </Link>
  );
}
