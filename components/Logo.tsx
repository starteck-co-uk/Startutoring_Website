import Link from 'next/link';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sq = size === 'sm' ? 'w-9 h-9 text-lg' : size === 'lg' ? 'w-14 h-14 text-3xl' : 'w-11 h-11 text-xl';
  const txt = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl';
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div
        className={`${sq} rounded-[12px] flex items-center justify-center font-bold text-[#1a1304] transition-all duration-300 group-hover:scale-110`}
        style={{
          background: 'linear-gradient(135deg, #ffd166 0%, #f5b72f 100%)',
          boxShadow: '0 6px 20px -4px rgba(245,183,47,0.5), inset 0 1px 0 rgba(255,255,255,0.35)'
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
