
'use client'

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { getRoles, createRole, updateRole, deleteRole } from "@/services/master-roles.service"
import type { Roles } from "@/types/master-roles"

// ─── colour helpers ──────────────────────────────────────────────────────────

const PRESET_COLORS = ["#00B69B", "#FCBE2D", "#FD5454", "#8280FF", "#4880FF"]

function roleColor(name: string) {
  const r = name.toLowerCase()
  if (r.includes("super")) return "#FCBE2D"
  if (r.includes("programmer")) return "#8280FF"
  if (r.includes("verifikator")) return "#FD5454"
  if (r.includes("admin")) return "#00B69B"
  return "#4880FF"
}

function formatDate(iso?: string) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

// ─── Add modal ───────────────────────────────────────────────────────────────

interface AddModalProps {
  onClose: () => void
  onSaved: () => void
}

function AddModal({ onClose, onSaved }: AddModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Semua field wajib diisi")
      return
    }
    setSaving(true)
    try {
      await createRole({ name: name.trim(), description: description.trim() })
      toast.success("Role berhasil ditambahkan")
      onSaved()
    } catch {
      toast.error("Gagal menambahkan role")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-[#202224]">Tambah Role Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Preview */}
          <div className="flex justify-center">
            <div className="w-48 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="h-16 w-full transition-colors duration-300" style={{ backgroundColor: color }} />
              <div className="px-3 py-3 text-center">
                <p className="text-sm font-bold text-[#202224] truncate">{name || "Nama Role"}</p>
                <p className="text-xs text-gray-400 truncate">{description || "Deskripsi role"}</p>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#202224]">Nama Role*</label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-[#F5F6FA] px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
              placeholder="Contoh: Administrator"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#202224]">Deskripsi Role*</label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-[#F5F6FA] px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
              placeholder="Jelaskan wewenang role ini"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#202224]">Warna Identitas</label>
            <div className="flex items-center gap-3 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${color === c ? "outline outline-2 outline-blue-400 outline-offset-2" : "hover:scale-105 opacity-80"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="relative h-8 w-8 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                <Plus className="h-4 w-4 text-gray-500" />
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button onClick={onClose}
            className="rounded-xl border border-gray-200 px-6 py-2 text-sm font-semibold text-[#202224] hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="rounded-xl bg-[#4880FF] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60 transition-all active:scale-95 flex items-center gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Edit modal ──────────────────────────────────────────────────────────────

interface EditModalProps {
  role: Roles
  onClose: () => void
  onSaved: () => void
}

function EditModal({ role, onClose, onSaved }: EditModalProps) {
  const [name, setName] = useState(role.name ?? "")
  const [description, setDescription] = useState(role.description ?? "")
  const [color, setColor] = useState(roleColor(role.name ?? ""))
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Semua field wajib diisi")
      return
    }
    setSaving(true)
    try {
      await updateRole(role.id!, { name: name.trim(), description: description.trim() })
      toast.success("Role berhasil diperbarui")
      onSaved()
    } catch {
      toast.error("Gagal memperbarui role")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-[#202224]">Edit Role</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Preview */}
          <div className="flex justify-center">
            <div className="w-48 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="h-16 w-full transition-colors duration-300" style={{ backgroundColor: color }} />
              <div className="px-3 py-3 text-center">
                <p className="text-sm font-bold text-[#202224] truncate">{name || "Nama Role"}</p>
                <p className="text-xs text-gray-400 truncate">{description || "Deskripsi role"}</p>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#202224]">Nama Role*</label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-[#F5F6FA] px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#202224]">Deskripsi Role*</label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-[#F5F6FA] px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#202224]">Warna Identitas</label>
            <div className="flex items-center gap-3 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ${color === c ? "outline outline-2 outline-blue-400 outline-offset-2" : "hover:scale-105 opacity-80"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <div className="relative h-8 w-8 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                <Plus className="h-4 w-4 text-gray-500" />
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button onClick={onClose}
            className="rounded-xl border border-gray-200 px-6 py-2 text-sm font-semibold text-[#202224] hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="rounded-xl bg-[#4880FF] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60 transition-all active:scale-95 flex items-center gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────

interface DeleteModalProps {
  role: Roles
  onClose: () => void
  onSaved: () => void
}

function DeleteModal({ role, onClose, onSaved }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteRole(role.id!)
      toast.success("Role berhasil dihapus")
      onSaved()
    } catch {
      toast.error("Gagal menghapus role")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold text-[#202224]">Hapus Role</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-[#202224]/70">
            Yakin ingin menghapus role <span className="font-bold text-[#202224]">{role.name}</span>? Tindakan ini tidak bisa dibatalkan.
          </p>
        </div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button onClick={onClose}
            className="rounded-xl border border-gray-200 px-6 py-2 text-sm font-semibold text-[#202224] hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="rounded-xl bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 transition-all active:scale-95 flex items-center gap-2">
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main client ──────────────────────────────────────────────────────────────

export default function MasterRolesClient() {
  const [data, setData] = useState<Roles[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editRole, setEditRole] = useState<Roles | null>(null)
  const [deleteRoleItem, setDeleteRoleItem] = useState<Roles | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getRoles()
      setData(res.data?.data ?? [])
    } catch {
      toast.error("Gagal mengambil data roles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="space-y-6 px-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#202224]">Master Roles</h1>
        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Read Only
        </span>
        {/*
          Sementara role management dibuat read-only dulu.
          Tombol tambah role disimpan di komentar agar mudah diaktifkan lagi.
        */}
        {/*
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Tambah Role
        </button>
        */}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-[6px_6px_54px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
          <span className="text-sm font-bold text-[#202224]">Semua Role</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-[#202224]/60">
            {loading ? "…" : data.length}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-sm text-[#202224]/50">
            <Loader2 className="h-5 w-5 animate-spin" />
            Memuat data...
          </div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-sm text-[#202224]/40">Belum ada role.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold text-left">
                <th className="px-5 py-3 w-8">No.</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Deskripsi</th>
                <th className="px-5 py-3">Dibuat</th>
                <th className="px-5 py-3">Diperbarui</th>
                {/*
                  Kolom aksi dimatikan sementara agar halaman ini read-only.
                */}
                {/* <th className="px-5 py-3 text-center">Aksi</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={item.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-[#202224]/50 font-medium">{i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: roleColor(item.name ?? "") }} />
                      <span className="font-semibold text-[#202224] capitalize">
                        {(item.name ?? "-").replace(/_/g, " ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#797A7C]">{item.description || "-"}</td>
                  <td className="px-5 py-3 text-[#797A7C]">{formatDate(item.created_at)}</td>
                  <td className="px-5 py-3 text-[#797A7C]">{formatDate(item.updated_at)}</td>
                  {/*
                    Tombol edit/hapus disembunyikan sementara.
                    Kalau role kembali boleh dikelola via UI, buka blok ini lagi.
                  */}
                  {/*
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditRole(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-[#767676] hover:bg-gray-50 transition active:scale-95"
                      >
                        <Pencil className="size-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteRoleItem(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition active:scale-95"
                      >
                        <Trash2 className="size-3" />
                        Hapus
                      </button>
                    </div>
                  </td>
                  */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {/*
        Seluruh modal CUD disimpan dulu dalam komentar.
        Nanti kalau perlu hidupkan CRUD lagi, blok ini bisa dibuka kembali.
      */}
      {/*
      {showAdd && (
        <AddModal
          onClose={() => setShowAdd(false)}
          onSaved={() => { setShowAdd(false); fetchData() }}
        />
      )}

      {editRole && (
        <EditModal
          role={editRole}
          onClose={() => setEditRole(null)}
          onSaved={() => { setEditRole(null); fetchData() }}
        />
      )}

      {deleteRoleItem && (
        <DeleteModal
          role={deleteRoleItem}
          onClose={() => setDeleteRoleItem(null)}
          onSaved={() => { setDeleteRoleItem(null); fetchData() }}
        />
      )}
      */}
    </div>
  )
}
