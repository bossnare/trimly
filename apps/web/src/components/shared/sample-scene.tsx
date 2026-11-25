interface SampleSceneProps {
  /** "cutout" renders only the subject, to preview a removed background. */
  variant?: "full" | "cutout";
}

/** Illustration used for demos before a real image is loaded (landing hero). */
export function SampleScene({ variant = "full" }: SampleSceneProps) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      {variant === "full" && (
        <>
          <rect width="400" height="300" fill="#cfe1dd" />
          <circle cx="320" cy="70" r="30" fill="#f0c25e" />
          <path d="M0 220L90 140L170 210L250 130L400 230V300H0Z" fill="#5f9d93" />
          <path d="M0 255Q120 215 240 245T400 235V300H0Z" fill="#3b7d72" />
        </>
      )}
      <path d="M172 250Q150 205 172 170V150H228V170Q250 205 228 250Z" fill="#c9724f" />
      <ellipse cx="200" cy="150" rx="30" ry="6" fill="#a95a3b" />
      <path d="M200 146Q180 100 160 96Q172 128 200 146Z" fill="#3f8f5c" />
      <path d="M200 146Q222 92 246 90Q234 126 200 146Z" fill="#2f7a4b" />
      <path d="M200 146V84" stroke="#2f7a4b" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
