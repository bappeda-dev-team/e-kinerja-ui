'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { TbEye, TbEyeClosed } from "react-icons/tb"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

interface FormValues {
  username: string
  password: string
}

const LoginPage = () => {
  const { handleSubmit } = useForm<FormValues>()
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    setLoading(true)

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (res?.error) {
      alert(res.error)
      setLoading(false)
    } else if (res?.ok) {
      router.push("/dashboard")
    } else {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800">
        Selamat Datang di E-Kinerja!
      </h1>

      <p className="text-lg text-gray-500 mt-2 mb-8">
        Silakan login ke akun Anda.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[360px]"
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
            className="w-full h-[52px] mt-2 px-4 bg-[#F5F6FA] border border-gray-300 rounded"
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
              className="w-full h-[52px] mt-2 px-4 pr-10 bg-[#F5F6FA] border border-gray-300 rounded"
            />

            <button
              type="button"
              className="absolute right-3 top-4 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <TbEye /> : <TbEyeClosed />}
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex justify-between items-center mb-6 text-sm">

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Ingat Saya
          </label>

          <button
            type="button"
            className="text-blue-500 font-semibold"
          >
            Pulihkan kata sandi
          </button>

        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[56px] bg-[#4880FF] text-white font-bold rounded-xl hover:opacity-90"
        >
          {loading ? "Loading..." : "Login"}
        </button>

      </form>

      {/* Footer */}
      <p className="absolute bottom-6 text-sm text-gray-500">
        © 2026 E-Kinerja. All Rights Reserved. Designed, Built & Maintained by Dev Team
      </p>

    </div>
  )
}

export default LoginPage