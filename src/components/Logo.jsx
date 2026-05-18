export default function Logo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >

      <rect width="40" height="40" rx="10" fill="#0f172a" />

      <circle cx="20" cy="13" r="5" fill="#e2e8f0" />

      <polygon points="20,6 28,10 20,14 12,10" fill="#f8fafc" />

      <rect x="16" y="6" width="8" height="1.5" rx="0.75" fill="#cbd5e1" />

      <line x1="27" y1="10" x2="27" y2="15" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />

      <circle cx="27" cy="15.5" r="1" fill="#94a3b8" />

      <path
        d="M12 32 C12 26 14 24 17 23 L20 25 L23 23 C26 24 28 26 28 32 Z"
        fill="#334155"
      />

      <path
        d="M17 23 L20 27 L23 23"
        stroke="#64748b"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}