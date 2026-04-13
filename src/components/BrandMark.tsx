import tooloraLogo from '../assets/logos/toolora-logo.webp';

interface BrandMarkProps {
  compact?: boolean;
  subtitle?: string;
  className?: string;
  textClassName?: string;
}

export const BrandMark = ({
  compact = false,
  subtitle = 'Fast File Toolkit',
  className = '',
  textClassName = '',
}: BrandMarkProps) => {
  const logoSize = compact ? 44 : 56;
  return (
    <div
      className={`inline-flex items-center gap-3 ${
        compact
          ? 'min-w-0'
          : 'rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.22)]'
      } ${className}`}
    >
        <img
          src={tooloraLogo}
          alt="VinzaTools logo"
          width={logoSize}
          height={logoSize}
          loading="eager"
          decoding="async"
          className={`${
            compact ? 'h-11 w-11' : 'h-14 w-14'
          } relative object-cover shadow-[0_10px_24px_rgba(0,0,0,0.24)]`}
        />
      
      <div className={`min-w-0 ${textClassName}`}>
        <div
          className={`${
            compact ? 'text-base leading-none' : 'text-xl leading-none'
          } font-black tracking-tight text-white`}
        >
          VinzaTools
        </div>
        <div
          className={`${
            compact ? 'mt-1 text-[9px] tracking-[0.22em]' : 'mt-1.5 text-[10px] tracking-[0.26em]'
          } uppercase text-rose-300/70 whitespace-nowrap`}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

