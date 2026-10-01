interface LogoMarkProps {
  className?: string;
  title?: string;
}

/** Three layers: evidence (cyan), policy (ivory), people reached (amber). Same mark as the favicon. */
export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      strokeWidth="1.9"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M3 10 L16 3 L29 10 L16 17 Z" stroke="#35D6CF" fill="#35D6CF" fillOpacity="0.16" />
      <path d="M3 16 L16 23 L29 16" stroke="#F2EFE5" />
      <path d="M3 22 L16 29 L29 22" stroke="#E3A94B" />
    </svg>
  );
}
