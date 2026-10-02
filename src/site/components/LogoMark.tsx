interface LogoProps {
  className?: string;
  /** "reversed" (ivory lettering) for the dark header and footer, "ink" for light backgrounds. */
  variant?: 'reversed' | 'ink';
}

/**
 * IP3's logo: "Public Policy & Practice Consulting". The PNGs in public/brand are the supplied artwork with its
 * white background made transparent. It is decorative here: the surrounding link carries the accessible name.
 */
export function Logo({ className, variant = 'reversed' }: LogoProps) {
  return (
    <img
      src={variant === 'ink' ? '/brand/ip3-logo.png' : '/brand/ip3-logo-reversed.png'}
      alt=""
      width={371}
      height={180}
      decoding="async"
      className={className}
    />
  );
}
