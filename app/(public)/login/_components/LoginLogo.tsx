import Image from "next/image"

const LoginLogo = () => (
  <div className="mb-6">
    <Image
      src="/logo.png"
      alt="Logo E-Kinerja"
      width={200}
      height={200}
      priority
      className="w-auto h-auto"
    />
  </div>
)

export default LoginLogo
