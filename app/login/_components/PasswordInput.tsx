'use client'

import { useState } from "react"
import { TbEye, TbEyeClosed } from "react-icons/tb"

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
}

const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mb-4">
      <label className="text-sm font-semibold text-gray-700">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan password Anda di sini"
          value={value}
          required
          onChange={(e) => onChange(e.target.value)}
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
  )
}

export default PasswordInput
