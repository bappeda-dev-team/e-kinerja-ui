'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { signIn, getSession } from "next-auth/react"
import { toast } from "sonner"
import { getRoleName } from "@/lib/roles"
import PasswordInput from "./PasswordInput"

interface FormValues {
  username: string
  password: string
}

const LoginForm = () => {
  const { handleSubmit } = useForm<FormValues>()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
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
        const roleName = getRoleName(session)

        toast.success("Login berhasil!")
        window.location.href = roleName ? "/dashboard" : "/login"
      }
    } catch {
      toast.error("Terjadi kesalahan, coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[360px]">
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700">Username</label>
        <input
          type="text"
          placeholder="Masukkan username Anda di sini"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          className="w-full h-[52px] mt-2 px-4 bg-[#F5F6FA] border border-gray-300 rounded focus:outline-none focus:border-blue-400"
        />
      </div>

      <PasswordInput value={password} onChange={setPassword} />

      <div className="flex justify-between items-center mb-6 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="accent-[#4880FF]" />
          Ingat Saya
        </label>
        <button type="button" className="text-blue-500 font-semibold hover:underline">
          Pulihkan kata sandi
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-[56px] bg-[#4880FF] text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:bg-gray-400"
      >
        {loading ? "Memproses..." : "Login"}
      </button>
    </form>
  )
}

export default LoginForm
