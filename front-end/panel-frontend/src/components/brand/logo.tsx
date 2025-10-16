export function BrandLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#g)"/>
      <path d="M16 24c0-4.418 3.582-8 8-8a8 8 0 0 1 7.5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M32 24c0 4.418-3.582 8-8 8a8 8 0 0 1-7.5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="g" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563eb"/>
          <stop offset="1" stopColor="#7c3aed"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
