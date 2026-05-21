import Image from "next/image"

const LoginLeftPanel = () => (
  <div className="hidden md:flex flex-col items-center justify-center w-[55%] h-full bg-white px-12">
    <div className="relative w-[98%] right-[8%] max-w-[820px] aspect-square">
      <Image
        src="/login-page.png"
        alt="Ilustrasi E-Kinerja"
        width={770}
        height={770}
        priority
        className="object-contain"
      />
    </div>
  </div>
)

export default LoginLeftPanel
