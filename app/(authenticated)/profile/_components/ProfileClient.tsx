"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Camera, Loader2, User } from "lucide-react"

import { getProfileById, updateProfilePicture } from "../_services"
import type { ProfileResponse } from "../_types"

export default function ProfileClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const userId = (session?.user as any)?.user_id ?? (session?.user as any)?.id

  useEffect(() => {
    if (status === "loading") return

    if (!userId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await getProfileById(userId)
        if (res.status === 200) {
          setProfile(res.data?.data ?? null)
        } else {
          toast.error(res.data?.message || "Gagal memuat profil")
        }
      } catch (err: any) {
        toast.error(err.message || "Terjadi kesalahan sistem")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId, status])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    try {
      setUploading(true)
      const res = await updateProfilePicture(userId, file)
      if (res.status === 200) {
        toast.success(res.data?.message || "Foto profil berhasil disimpan")
        // refresh profile to get new picture URL
        const updated = await getProfileById(userId)
        if (updated.status === 200) setProfile(updated.data?.data ?? null)
      } else {
        toast.error(res.data?.message || "Gagal mengunggah foto profil")
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan sistem")
    } finally {
      setUploading(false)
      // reset input so same file can be re-selected
      e.target.value = ""
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">Memuat profil...</p>
      </div>
    )
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
        className="bg-white border border-[#B9B9B9] rounded-[14px] px-10 py-8 space-y-5"
        style={{ borderWidth: "0.3px" }}
      >
        {/* Avatar + Ubah */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 border border-[#D5D5D5] rounded-md px-4 py-2 text-sm font-semibold text-[#606060] hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            {uploading ? "Mengunggah..." : "Ubah"}
          </button>
        </div>

        <Field label="Nama Lengkap" value={profile.full_name} />
        <Field label="Username" value={profile.username} />
        <Field label="Peran" value={profile.role.description} />
        <Field label="Status" value={profile.is_active ? "Aktif" : "Tidak Aktif"} />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg border border-[#D5D5D5] text-sm font-semibold text-[#202224] hover:bg-gray-50 transition"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Batal
          </button>
          <button
            className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition"
            style={{ fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-sm font-semibold text-[#606060]"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        {label}
      </label>
      <div
        className="w-full bg-[#F5F6FA] border border-[#D5D5D5] rounded px-4 py-2.5 text-sm text-[#606060]"
        style={{ borderWidth: "0.6px", fontFamily: "'Nunito Sans', sans-serif" }}
      >
        {value}
      </div>
    </div>
  )
}
