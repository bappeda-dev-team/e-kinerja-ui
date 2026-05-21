const WaveSeparator = () => (
  <div className="absolute top-0 left-[53%] -translate-x-1/2 h-full w-[80px] z-10 hidden md:block">
    <svg
      viewBox="0 0 80 900"
      preserveAspectRatio="none"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M80,0 L40,0 Q0,90 40,180 Q80,270 40,360 Q0,450 40,540 Q80,630 40,720 Q0,810 40,900 L80,900 Z"
        fill="#4880FF"
      />
    </svg>
  </div>
)

export default WaveSeparator
