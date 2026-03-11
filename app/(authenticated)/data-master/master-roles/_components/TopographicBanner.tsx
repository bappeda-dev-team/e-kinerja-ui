interface Props {
  color: string
}

export default function TopographicBanner({ color }: Props) {
  // SVG topographic contour lines pattern
  return (
    <div
      className="h-36 w-full rounded-t-2xl overflow-hidden"
      style={{ backgroundColor: color }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 144"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Topographic contour lines */}
        {[
          "M-20,30 Q60,10 120,40 Q180,70 250,35 Q320,0 420,25",
          "M-20,50 Q70,25 140,58 Q200,85 270,52 Q340,18 420,45",
          "M-20,72 Q50,48 110,75 Q175,100 240,68 Q310,38 420,65",
          "M-20,92 Q60,68 130,95 Q190,118 260,88 Q330,58 420,85",
          "M-20,112 Q55,90 120,115 Q185,138 255,108 Q325,78 420,108",
          "M-20,132 Q65,108 135,135 Q200,158 268,128 Q338,98 420,128",
          "M-20,10 Q80,-5 150,22 Q215,48 285,18 Q355,-10 420,8",
          "M-20,152 Q70,128 140,152 Q210,175 278,148 Q348,118 420,148",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.5"
          />
        ))}
        {/* Additional organic closed contour shapes */}
        <ellipse cx="80" cy="72" rx="55" ry="35" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <ellipse cx="80" cy="72" rx="35" ry="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <ellipse cx="310" cy="60" rx="60" ry="38" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <ellipse cx="310" cy="60" rx="38" ry="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <ellipse cx="200" cy="110" rx="50" ry="28" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
