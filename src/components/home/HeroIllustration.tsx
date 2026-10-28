/** Ilustrasi hero buatan sendiri (SVG): kartu, pizza 3D-ish, gelas susu, dan label pecahan. */
export function HeroIllustration() {
  const slices = Array.from({ length: 8 }, (_, i) => i)
  const polar = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)] as const
  }
  return (
    <svg viewBox="0 0 400 360" role="img" aria-label="Ilustrasi kartu belajar dengan pizza pecahan 3 per 8 yang muncul dari layar HP" className="h-auto w-full">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#c7d2fe" />
          <stop offset="1" stopColor="#fbcfe8" />
        </linearGradient>
        <linearGradient id="phone" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#312e81" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="185" rx="185" ry="165" fill="url(#bg)" />

      {/* HP */}
      <g transform="translate(125 70) rotate(-6 75 130)">
        <rect width="150" height="250" rx="26" fill="url(#phone)" />
        <rect x="9" y="12" width="132" height="226" rx="18" fill="#e0e7ff" />
        <rect x="55" y="16" width="40" height="6" rx="3" fill="#312e81" />
        {/* kartu di layar */}
        <rect x="30" y="150" width="90" height="64" rx="10" fill="#fff" stroke="#6366f1" strokeWidth="3" strokeDasharray="6 4" />
        <text x="75" y="188" textAnchor="middle" fontSize="20" fontWeight="800" fill="#4f46e5">KARTU</text>
      </g>

      {/* Pizza melayang */}
      <g transform="translate(100 25)" className="animate-float" style={{ transformOrigin: '200px 120px' }}>
        <g transform="scale(0.95)">
          <circle cx="100" cy="104" r="62" fill="#b45309" opacity="0.25" />
          <circle cx="100" cy="100" r="62" fill="#fbbf24" stroke="#b45309" strokeWidth="6" />
          {slices.map((i) => {
            const [x1, y1] = polar(i * 45, 62)
            return <line key={i} x1="100" y1="100" x2={x1} y2={y1} stroke="#b45309" strokeWidth="3" />
          })}
          {/* 3 potong disorot */}
          {[0, 1, 2].map((i) => {
            const [x1, y1] = polar(i * 45, 58)
            const [x2, y2] = polar((i + 1) * 45, 58)
            return <path key={i} d={`M100 100 L${x1} ${y1} A58 58 0 0 1 ${x2} ${y2} Z`} fill="#f87171" opacity="0.85" />
          })}
          {[[130, 70], [118, 125], [80, 120], [70, 80]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="6" fill="#b91c1c" />
          ))}
        </g>
      </g>

      {/* Label pecahan */}
      <g className="animate-float" style={{ animationDelay: '-1.5s' }}>
        <rect x="285" y="60" width="86" height="52" rx="16" fill="#fde047" />
        <text x="328" y="96" textAnchor="middle" fontSize="28" fontWeight="900" fill="#78350f">3/8</text>
      </g>
      <g className="animate-float" style={{ animationDelay: '-2.5s' }}>
        <rect x="20" y="150" width="84" height="50" rx="16" fill="#6ee7b7" />
        <text x="62" y="185" textAnchor="middle" fontSize="26" fontWeight="900" fill="#064e3b">0,5</text>
      </g>
      <g className="animate-float" style={{ animationDelay: '-0.8s' }}>
        <rect x="290" y="240" width="80" height="50" rx="16" fill="#fda4af" />
        <text x="330" y="275" textAnchor="middle" fontSize="26" fontWeight="900" fill="#881337">50%</text>
      </g>
      <path d="M40 70 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z" fill="#fff" />
      <path d="M350 170 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z" fill="#fff" />
    </svg>
  )
}
