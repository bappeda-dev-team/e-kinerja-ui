// app/super-admin/distribusi/_components/modals/KomentarModal.tsx

"use client"

import { useState } from "react"
import { Send, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { DistribusiKomentar } from "../../types"

interface Props {
  komentars: DistribusiKomentar[]
  onClose: () => void
  onSend?: (komentar: string) => Promise<void> | void
  loading?: boolean
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?"
}

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return `hsl(${Math.abs(hash) % 360}, 55%, 48%)`
}

function formatWaktu(date: string) {
  if (!date) return "-"
  return new Date(date).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getKomentarText(item: DistribusiKomentar) {
  return item.komentar ?? item.komentars ?? ""
}

export default function KomentarModal({ komentars, onClose, onSend, loading = false }: Props) {
  const [input, setInput] = useState("")

  const handleSend = async () => {
    if (!input.trim()) return
    await onSend?.(input.trim())
    setInput("")
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl [&>button]:hidden">
        <VisuallyHidden><DialogTitle>Komentar</DialogTitle></VisuallyHidden>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-[#202224]">Komentar</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat messages */}
        <div className="px-4 py-3 space-y-4 max-h-[360px] overflow-y-auto bg-gray-50/60">
          {komentars.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-400">
              Belum ada komentar.
            </div>
          ) : (
            komentars.map((c) => {
              const name = c.full_name || "Pengguna"
              return (
                <div key={c.id} className="flex gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                    style={{ background: avatarColor(name) }}
                  >
                    {initials(name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#202224]">{name}</span>
                      <span className="text-[11px] text-gray-400">{formatWaktu(c.created_at)}</span>
                    </div>
                    <div className="whitespace-pre-wrap rounded-xl bg-white border border-gray-100 px-3 py-2.5 text-sm text-[#202224] leading-relaxed shadow-sm">
                      {getKomentarText(c)}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis komentar..."
              rows={2}
              className="w-full px-3 pt-2.5 text-sm text-[#202224] placeholder:text-gray-400 resize-none outline-none bg-white"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              <span className="text-[11px] text-gray-400">Tekan Shift + Enter untuk baris baru</span>
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4880FF] text-white text-xs font-bold hover:bg-blue-600 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Kirim"} <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
