import Image from "next/image"

const LoginLeftPanel = () => (
  <div className="hidden md:flex flex-col items-center justify-center w-[55%] h-full bg-white px-12">
    <div className="flex flex-col items-center w-[98%] right-[8%] max-w-[820px]">
      <div className="text-center mb-2">
        <h1 className="text-4xl font-bold text-[#4880FF]">E-Kinerja</h1>
        <p className="text-gray-500 text-sm mt-1">Sistem Manajemen Kinerja</p>
      </div>
      <div className="relative w-full aspect-square">
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
  </div>
)

export default LoginLeftPanel
