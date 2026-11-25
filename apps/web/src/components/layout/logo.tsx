import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="Trimly" className={cn("size-8", className)}>
      <rect width="120" height="120" rx="28" className="fill-brand-fill" />
      <path
        d="M28 46V34Q28 28 34 28H46M92 74V86Q92 92 86 92H74"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M44 42H76M60 42V78" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      aria-label="Trimly home"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className,
      )}
    >
      <LogoMark />
      <span className="font-heading text-xl font-extrabold tracking-tight">Trimly</span>
    </Link>
  );
}
