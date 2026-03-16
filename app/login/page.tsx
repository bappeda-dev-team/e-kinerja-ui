'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { TbEye, TbEyeClosed } from "react-icons/tb"
import { signIn, getSession } from "next-auth/react"
import { setCookie } from "cookies-next"
import { toast } from "sonner"
import Image from "next/image" // Import komponen Image

interface FormValues {
  username: string
  password: string
}

const LoginPage = () => {
  const { handleSubmit } = useForm<FormValues>()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

const onSubmit = async () => {
  setLoading(true)
  try {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Username atau password salah!")
    } else {
      const session = await getSession()
      // Simpan token ke cookie jika perlu
      // setCookie("token", session?.user?.token)
      
      toast.success("Login berhasil!")
      window.location.href = "/dashboard" // arahkan ke halaman utama
    }
  } catch (error) {
    toast.error("Terjadi kesalahan, coba lagi.")
  } finally {
    setLoading(false) // ← PENTING: selalu set false di akhir
  }
}

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white p-4">
      
      {/* Logo Section */}
      <div className="mb-6">
        <Image 
          src="/logo-e-kinerja.png" 
          alt="Logo E-Kinerja" 
          width={120} // Sesuaikan ukuran sesuai keinginan
          height={120}
          priority // Mempercepat loading gambar utama
          className="w-auto h-auto"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Selamat Datang di E-Kinerja!
      </h1>

      <p className="text-lg text-gray-500 mt-2 mb-8 text-center">
        Silakan login ke akun Anda.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[360px]"
      >
        {/* Username */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-500">
            Username
          </label>
          <input
            type="text"
            placeholder="Masukkan username Anda di sini"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-[52px] mt-2 px-4 bg-[#F5F6FA] border border-gray-300 rounded focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-500">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password Anda di sini"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[52px] mt-2 px-4 pr-12 bg-[#F5F6FA] border border-gray-300 rounded focus:outline-none focus:border-blue-400"
            />
            <button
              type="button"
              className="absolute right-4 top-[22px] text-gray-500 text-xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <TbEye /> : <TbEyeClosed />}
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex justify-between items-center mb-6 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-[#4880FF]" />
            Ingat Saya
          </label>
          <button type="button" className="text-blue-500 font-semibold hover:underline">
            Pulihkan kata sandi
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[56px] bg-[#4880FF] text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-gray-500 text-center px-4">
        © 2026 E-Kinerja. All Rights Reserved. Designed, Built & Maintained by Dev Team
      </footer>

    </div>
  )
}

export default LoginPage