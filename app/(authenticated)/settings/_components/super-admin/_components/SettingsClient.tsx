
"use client"

import { useState } from "react"
import { Eye, EyeOff, Globe, Chrome, Monitor, Loader2 } from "lucide-react"
import { toast } from "sonner"

type Tab = "akun" | "keamanan" | "preferensi"

const TABS: { key: Tab; label: string }[] = [
  { key: "akun", label: "Akun" },
  { key: "keamanan", label: "Keamanan" },
  { key: "preferensi", label: "Preferensi" },
]

// Mock active sessions
const SESSIONS = [
  { id: 1, lokasi: "Bandung, Indonesia", browser: "Chrome", icon: "chrome", ip: "192.168.1.22", lastActive: "5 menit yang lalu" },
  { id: 2, lokasi: "Sragen, Indonesia", browser: "Edge", icon: "edge", ip: "192.168.1.6", lastActive: "9 Februari 2026" },
  { id: 3, lokasi: "Surakarta, Indonesia", browser: "Chrome", icon: "chrome", ip: "192.168.1.14", lastActive: "8 Januari 2026" },
]

function BrowserIcon({ type }: { type: string }) {
  if (type === "edge") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#0078D4" />
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#50E6FF" />
        <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4" fill="#0078D4" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#4285F4" />
      <circle cx="12" cy="12" r="4" fill="white" />
      <path d="M12 2a10 10 0 0 1 8.66 5H12V2z" fill="#EA4335" />
      <path d="M2 12a10 10 0 0 1 5-8.66L10.5 12H2z" fill="#FBBC05" />
      <path d="M12 22a10 10 0 0 1-8.66-5L10.5 12l7.5 5A10 10 0 0 1 12 22z" fill="#34A853" />
    </svg>
  )
}

function AkunTab() {
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(false)
  const [language, setLanguage] = useState("id")

  return (
    <div className="space-y-5">
      {/* Notifikasi */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl px-8 py-6 space-y-4" style={{ borderWidth: "0.3px" }}>
        <h2 className="font-semibold text-[20px] leading-[27px] tracking-[-0.114286px] text-[#4C4C4C]"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Notifikasi
        </h2>
        <p className="text-sm font-semibold text-[#606060]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Kelola preferensi notifikasi Anda.
        </p>

        <div className="flex items-center justify-between py-3 border-b border-[#E0E0E0]/60">
          <div>
            <p className="text-sm font-semibold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Notifikasi Email
            </p>
            <p className="text-xs text-[#606060] mt-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Terima notifikasi melalui email
            </p>
          </div>
          <Toggle value={notifEmail} onChange={setNotifEmail} />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-semibold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Notifikasi Push
            </p>
            <p className="text-xs text-[#606060] mt-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Terima notifikasi push di perangkat ini
            </p>
          </div>
          <Toggle value={notifPush} onChange={setNotifPush} />
        </div>
      </div>

      {/* Bahasa */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl px-8 py-6 space-y-4" style={{ borderWidth: "0.3px" }}>
        <h2 className="font-semibold text-[20px] leading-[27px] tracking-[-0.114286px] text-[#4C4C4C]"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Bahasa &amp; Wilayah
        </h2>
        <p className="text-sm font-semibold text-[#606060]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Atur bahasa tampilan aplikasi.
        </p>

        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-[#606060]" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-[#D5D5D5] rounded-lg px-4 py-2 text-sm text-[#202224] bg-white focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20"
            style={{ fontFamily: "'Nunito Sans', sans-serif", borderWidth: "0.6px" }}
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => toast.success("Pengaturan disimpan")}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition active:scale-95"
            style={{ backgroundColor: "#4880FF", fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

function KeamananTab() {
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [twoFactor, setTwoFactor] = useState(true)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })

  const handleChangePassword = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Semua kolom harus diisi")
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok")
      return
    }
    try {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 1200))
      toast.success("Kata sandi berhasil diubah")
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Ganti Password */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl px-8 py-6 space-y-5" style={{ borderWidth: "0.3px" }}>
        <div>
          <h2 className="font-bold text-[20px] leading-[27px] tracking-[-0.114286px] text-[#4C4C4C] flex items-center gap-2"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            <span>🔑</span> Ganti Password
          </h2>
          <p className="text-sm font-semibold text-[#606060] mt-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Atur ulang kata sandi akun Anda.
          </p>
        </div>

        <PasswordField
          label="Kata Sandi Lama"
          value={form.oldPassword}
          show={showOld}
          onToggle={() => setShowOld(!showOld)}
          onChange={(v) => setForm({ ...form, oldPassword: v })}
        />
        <PasswordField
          label="Kata Sandi Baru"
          value={form.newPassword}
          show={showNew}
          onToggle={() => setShowNew(!showNew)}
          onChange={(v) => setForm({ ...form, newPassword: v })}
        />
        <PasswordField
          label="Konfirmasi Kata Sandi Baru"
          value={form.confirmPassword}
          show={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
          onChange={(v) => setForm({ ...form, confirmPassword: v })}
        />

        <div>
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition active:scale-95 disabled:opacity-70 flex items-center gap-2"
            style={{ backgroundColor: "#4880FF", fontFamily: "'Nunito Sans', sans-serif" }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Ubah Kata Sandi
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl px-8 py-6" style={{ borderWidth: "0.3px" }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[20px] leading-[27px] tracking-[-0.114286px] text-[#4C4C4C] flex items-center gap-2"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              <span>🛡️</span> Two-Factor Authentication
            </h2>
            <p className="text-sm font-semibold text-[#606060] mt-1" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Aktifkan autentikasi dua faktor untuk keamanan ekstra akun Anda.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#606060]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              {twoFactor ? "Aktif" : "Nonaktif"}
            </span>
            <Toggle value={twoFactor} onChange={setTwoFactor} />
          </div>
        </div>
      </div>

      {/* Sesi Aktif */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl px-8 py-6 space-y-4" style={{ borderWidth: "0.3px" }}>
        <h2 className="font-bold text-[20px] leading-[27px] tracking-[-0.114286px] text-[#4C4C4C]"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Sesi Aktif
        </h2>

        <div className="rounded-xl overflow-hidden border border-[#E0E0E0]" style={{ borderWidth: "0.3px" }}>
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-[#F1F4F9] px-5 py-3">
            {["Lokasi", "Browser", "IP Address", "Terakhir Aktif"].map((h) => (
              <span key={h} className="text-sm font-bold text-[#202224]"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                {h}
              </span>
            ))}
          </div>

          {SESSIONS.map((s, i) => (
            <div key={s.id}>
              <div className="grid grid-cols-4 items-center px-5 py-4">
                <span className="text-sm font-semibold text-[#202224] opacity-80"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  {s.lokasi}
                </span>
                <div className="flex items-center gap-2">
                  <BrowserIcon type={s.icon} />
                  <span className="text-sm font-semibold text-[#202224] opacity-80"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                    {s.browser}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#202224] opacity-80"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  {s.ip}
                </span>
                <span className="text-sm font-semibold text-[#202224] opacity-80"
                  style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                  {s.lastActive}
                </span>
              </div>
              {i < SESSIONS.length - 1 && (
                <div className="mx-5 border-t border-[#979797] opacity-40" />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => toast.error("Semua sesi telah diakhiri")}
          className="text-[20px] font-bold leading-[27px] tracking-[-0.114286px] text-[#FD5454] hover:underline transition"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
        >
          Keluar Dari Semua Sesi
        </button>
      </div>
    </div>
  )
}

function PreferensiTab() {
  const [darkMode, setDarkMode] = useState(false)
  const [compactView, setCompactView] = useState(false)

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#E0E0E0] rounded-2xl px-8 py-6 space-y-4" style={{ borderWidth: "0.3px" }}>
        <h2 className="font-bold text-[20px] leading-[27px] tracking-[-0.114286px] text-[#4C4C4C]"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Tampilan
        </h2>
        <p className="text-sm font-semibold text-[#606060]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Sesuaikan tampilan aplikasi.
        </p>

        <div className="flex items-center justify-between py-3 border-b border-[#E0E0E0]/60">
          <div>
            <p className="text-sm font-semibold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Mode Gelap
            </p>
            <p className="text-xs text-[#606060] mt-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Gunakan tema gelap di seluruh aplikasi
            </p>
          </div>
          <Toggle value={darkMode} onChange={setDarkMode} />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-semibold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Tampilan Ringkas
            </p>
            <p className="text-xs text-[#606060] mt-0.5" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              Kurangi spasi antar elemen untuk menampilkan lebih banyak konten
            </p>
          </div>
          <Toggle value={compactView} onChange={setCompactView} />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => toast.success("Preferensi disimpan")}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition active:scale-95"
            style={{ backgroundColor: "#4880FF", fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
        value ? "bg-[#4880FF]" : "bg-[#E0E0E0]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          value ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  )
}

function PasswordField({
  label,
  value,
  show,
  onToggle,
  onChange,
}: {
  label: string
  value: string
  show: boolean
  onToggle: () => void
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[#606060]"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[#D5D5D5] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#202224] bg-white focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20 focus:border-[#4880FF]"
          style={{ borderWidth: "0.6px", fontFamily: "'Nunito Sans', sans-serif" }}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606060] hover:text-[#202224]"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("keamanan")

  return (
    <div>
      <h1
        className="font-bold text-[32px] leading-[44px] tracking-[-0.114286px] text-[#202224] mb-6"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        Pengaturan
      </h1>

      {/* Tabs */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl mb-5" style={{ borderWidth: "0.3px" }}>
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-8 py-4 text-[20px] font-semibold leading-[27px] tracking-[-0.114286px] transition-colors relative ${
                activeTab === tab.key
                  ? "text-[#4880FF]"
                  : "text-[#4C4C4C] hover:text-[#202224]"
              }`}
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4880FF] rounded-t-lg" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "akun" && <AkunTab />}
      {activeTab === "keamanan" && <KeamananTab />}
      {activeTab === "preferensi" && <PreferensiTab />}
    </div>
  )
}
