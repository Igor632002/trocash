type IconProps = { size?: number };

export function SearchIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon({ size = 26 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 7h20M4 14h20M4 21h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRight({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.8-2.8 8.1-7 10-4.2-1.9-7-5.2-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="m9.4 12 1.7 1.8 3.7-4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LeafIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 4C11.2 4.2 5.5 7.2 5.5 13.2c0 2.8 2 4.7 4.7 4.7C16.2 17.9 19 11.4 19 4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c2.4-4.6 6.1-7.4 10.9-10.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function UsersIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.5" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 19c.5-3.1 2.3-4.8 5.5-4.8s5.1 1.7 5.5 4.8M14.5 14.8c2.7-.1 4.7 1.2 5.3 3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function GlobeIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.8 12h16.4M12 3.4c2.2 2.3 3.4 5.1 3.4 8.6 0 3.6-1.2 6.4-3.4 8.6-2.2-2.2-3.4-5-3.4-8.6 0-3.5 1.2-6.3 3.4-8.6Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function GridIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.7" />
      <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function ShirtIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.5 5.1 5 7.2l-2 4 3.3 1.7L8 10.7V20h8v-9.3l1.7 2.2 3.3-1.7-2-4-3.5-2.1c-.8 1-2 1.7-3.5 1.7s-2.7-.7-3.5-1.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m3.5 11.3 8.5-7 8.5 7v8.2a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-8.2Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 20.5v-6.2h6v6.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function CarIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5.2 10.3 1.7-4.1c.3-.7.9-1.1 1.7-1.1h7.2c.8 0 1.4.4 1.7 1.1l1.7 4.1 1.2.7c.4.2.6.6.6 1.1v4.1c0 .7-.5 1.2-1.2 1.2H4.2c-.7 0-1.2-.5-1.2-1.2v-4.1c0-.5.2-.9.6-1.1l1.6-.7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="6.5" cy="16.4" r="1.3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="16.4" r="1.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.7 10.2h10.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DiamondIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m4 8 3-4h10l3 4-8 12L4 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 8h16M8 4l4 16 4-16M7.3 8 12 20l4.7-12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function InfinityIcon({ size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 24" fill="none" aria-hidden="true">
      <path d="M8.2 18c-3.2 0-5.2-2.5-5.2-6s2-6 5.2-6c3.2 0 5.1 2.5 7.8 6 2.7 3.5 4.6 6 7.8 6 3.2 0 5.2-2.5 5.2-6s-2-6-5.2-6c-3.2 0-5.1 2.5-7.8 6C13.3 15.5 11.4 18 8.2 18Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ size = 25 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.3 5.8c-1.8-2-4.9-1.7-6.6.4L12 8.2l-1.7-2c-1.7-2.1-4.8-2.4-6.6-.4-1.9 2.1-1.5 5.2.4 7.1L12 20l7.9-7.1c1.9-1.9 2.3-5 .4-7.1Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function LeafLineIcon({ size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M12 52C27 43 42 28 51 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M45 16C50 10 57 8 62 8c-1 8-5 14-15 17M36 29c3-6 10-10 17-10-1 7-6 12-14 14M25 40c2-6 7-9 13-10-1 7-5 11-11 13Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
