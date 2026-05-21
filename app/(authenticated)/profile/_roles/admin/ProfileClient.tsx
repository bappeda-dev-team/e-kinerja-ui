"use client"

import { useRef, useState } from "react"
import { toast } from "sonner"
import { Camera, Loader2, Pencil, User } from "lucide-react"

import { getProfileById, updateProfilePicture } from "@/services/profile.service"
import type { ProfileResponse } from "@/types/profile"

const HybridLoader = () => {
  const [progress, setProgress] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-100" />
          <circle
            cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            className="text-blue-600 transition-all duration-300 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-blue-600 animate-bounce text-xl">⏳</span>
          <span className="text-[10px] font-bold text-blue-600">{progress}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[#202224]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Sedang memproses...
        </p>
        <p className="text-[11px] text-[#202224]/50" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
          Mohon tunggu sebentar
        </p>
      </div>
    </div>
  );
};

interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (val: string) => void;
}

interface ProfileClientProps {
  initialProfile: ProfileResponse | null
}

export default function ProfileClient({ initialProfile }: ProfileClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<ProfileResponse | null>(initialProfile)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: initialProfile?.full_name || "",
    username: initialProfile?.username || "",
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const userId = profile?.id
    if (!file || !userId) return

    try {
      setUploading(true)
      const res = await updateProfilePicture(userId, file)
      if (res.status === 200) {
        toast.success(res.data?.message || "Foto profil berhasil disimpan")
        const updated = await getProfileById(userId)
        if (updated.status === 200) setProfile(updated.data?.data ?? null)
      } else {
        toast.error(res.data?.message || "Gagal mengunggah foto profil")
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Profil berhasil diperbarui")
      setIsEditing(false)
    } catch (error) {
      toast.error("Gagal menyimpan perubahan")
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">Data profil tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div>
      <h1
        className="font-bold text-[32px] leading-[44px] tracking-[-0.114286px] text-[#202224] mb-6"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        Profil
      </h1>

      <div
        className="bg-white border border-[#B9B9B9] rounded-2xl px-10 py-8 space-y-5"
        style={{ borderWidth: "0.3px" }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 border">
              {profile.profile_picture ? (
                <img src={profile.profile_picture} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 border border-[#D5D5D5] rounded-md px-4 py-2 text-sm font-semibold text-[#606060] hover:bg-gray-50 transition disabled:opacity-60"
                style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                {uploading ? "Mengunggah..." : "Ubah"}
              </button>
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#D5D5D5] text-sm font-semibold text-[#606060] hover:bg-gray-50 transition"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              <Pencil className="w-4 h-4" />
              Edit Profil
            </button>
          )}
        </div>

        <EditableField
          label="Nama Lengkap"
          value={formData.full_name}
          isEditing={isEditing}
          onChange={(val: string) => setFormData({ ...formData, full_name: val })}
        />
        <EditableField
          label="Username"
          value={formData.username}
          isEditing={isEditing}
          onChange={(val: string) => setFormData({ ...formData, username: val })}
        />

        <ReadOnlyField label="Peran" value={profile.role.description} />
        <ReadOnlyField label="Status" value={profile.is_active ? "Aktif" : "Tidak Aktif"} />

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-lg border border-[#D5D5D5] text-sm font-semibold text-[#202224] hover:bg-gray-50 transition"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg transition active:scale-95 font-semibold text-sm text-white disabled:opacity-70 flex items-center justify-center"
              style={{ backgroundColor: "#4880FF", fontFamily: "var(--font-sans)", minWidth: "108px" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function EditableField({ label, value, isEditing, onChange }: EditableFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[#606060]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={!isEditing}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4880FF]/20
          ${isEditing
            ? "bg-white border-[#4880FF] text-black"
            : "bg-[#F5F6FA] border-[#D5D5D5] text-[#606060] cursor-not-allowed"
          }`}
        style={{ borderWidth: "0.6px", fontFamily: "'Nunito Sans', sans-serif" }}
      />
    </div>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[#606060]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
        {label}
      </label>
      <div
        className="w-full bg-[#F5F6FA] border border-[#D5D5D5] rounded px-4 py-2.5 text-sm text-[#606060] opacity-70"
        style={{ borderWidth: "0.6px", fontFamily: "'Nunito Sans', sans-serif" }}
      >
        {value}
      </div>
    </div>
  )
}
