export function HandDrawnBotanicalVine({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 32"
      className={`w-full max-w-sm mx-auto overflow-visible pointer-events-none opacity-60 ${className}`}
      fill="none"
    >
      <path
        d="M 20 16 C 80 8, 140 24, 200 16 C 260 8, 320 24, 380 16"
        stroke="#8c6d4f"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Leaves along the vine */}
      <path d="M 80 14 C 75 7, 85 4, 90 10 C 85 12, 82 14, 80 14 Z" fill="#466c42" opacity="0.75" />
      <path d="M 140 18 C 145 25, 135 28, 130 22 C 135 20, 138 18, 140 18 Z" fill="#466c42" opacity="0.75" />
      <path d="M 260 14 C 255 7, 265 4, 270 10 C 265 12, 262 14, 260 14 Z" fill="#466c42" opacity="0.75" />
      <path d="M 320 18 C 325 25, 315 28, 310 22 C 315 20, 318 18, 320 18 Z" fill="#466c42" opacity="0.75" />
      {/* Central berry / flower */}
      <circle cx="200" cy="16" r="3" fill="#5c141e" />
      <circle cx="194" cy="14" r="1.8" fill="#b89243" />
      <circle cx="206" cy="14" r="1.8" fill="#b89243" />
    </svg>
  );
}


