
"use client"

import { useState } from "react"
import { X, Paperclip, AtSign, Send } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const MOCK_COMMENTS = [
  {
    id: 1,
    nama: "Pak Yoga",
    role: "Admin",
    roleCls: "bg-purple-100 text-purple-600",
    initials: "PY",
    avatarCls: "bg-gray-500",
    waktu: "25 Mar 2026 · 11:00",
    pesan: "Pekerjaan didistribusikan ke @Zulfikar . Deadline 5 April, mohon update progress setiap Senin.",
  },
  {
    id: 2,
    nama: "Daniel",
    role: "Programmer",
    roleCls: "bg-blue-100 text-blue-600",
    initials: "DA",
    avatarCls: "bg-blue-500",
    waktu: "27 Mar 2026 · 16:30",
    pesan: "Update: query laporan sudah selesai. Saat ini sedang testing performa di data 100rb baris.",
  },
]

interface Props {
  onClose: () => void
}

export default function KomentarModal({ onClose }: Props) {
  const [input, setInput] = useState("")
  const [comments, setComments] = useState(MOCK_COMMENTS)

  const handleSend = () => {
    if (!input.trim()) return
    setComments((prev) => [...prev, {
      id: Date.now(),
      nama: "Pak Yoga",
      role: "Admin",
      roleCls: "bg-purple-100 text-purple-600",
      initials: "PY",
      avatarCls: "bg-gray-500",
      waktu: new Date().toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      pesan: input.trim(),
    }])
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
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className={`w-9 h-9 rounded-full ${c.avatarCls} flex items-center justify-center shrink-0 text-xs font-bold text-white`}>
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-[#202224]">{c.nama}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.roleCls}`}>{c.role}</span>
                  <span className="text-[11px] text-gray-400">{c.waktu}</span>
                </div>
                <div className="rounded-xl bg-white border border-gray-100 px-3 py-2.5 text-sm text-[#202224] leading-relaxed shadow-sm">
                  {c.pesan.split(/(@\w+)/g).map((part, i) =>
                    part.startsWith("@") ? (
                      <span key={i} className="text-[#4880FF] font-semibold">{part}</span>
                    ) : part
                  )}
                </div>
              </div>
            </div>
          ))}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              <div className="flex items-center gap-2">
                <button type="button" className="text-gray-400 hover:text-gray-600 transition">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" className="text-gray-400 hover:text-gray-600 transition">
                  <AtSign className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSend}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4880FF] text-white text-xs font-bold hover:bg-blue-600 transition"
              >
                Kirim <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
