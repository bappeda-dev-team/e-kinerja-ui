"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bold, Italic, Link, ThumbsUp, ThumbsDown } from "lucide-react"

interface Komentar {
  id: string
  nama: string
  teks: string
  waktu?: string
}

interface Props {
  komentar: string
  onClose: () => void
}

function MiniAvatar({ nama }: { nama: string }) {
  const colors = [
    "from-pink-400 to-rose-500",
    "from-blue-400 to-indigo-500",
    "from-green-400 to-teal-500",
    "from-orange-400 to-amber-500",
    "from-purple-400 to-violet-500",
  ]
  const color = colors[nama.charCodeAt(0) % colors.length]
  return (
    <div className={`w-10 h-10 rounded-full bg-linear-to-br ${color} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
      {nama.charAt(0).toUpperCase()}
    </div>
  )
}

export default function KomentarModal({ komentar, onClose }: Props) {
  const [newKomentar, setNewKomentar] = useState("")

  // Parse komentar string jadi list — untuk sekarang tampilkan sebagai satu komentar
  const komentarList: Komentar[] = [
    { id: "1", nama: "Admin", teks: komentar, waktu: "Baru saja" }
  ]

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[460px] p-0 overflow-hidden rounded-2xl">
        <div className="p-7 space-y-5">
          <DialogTitle className="text-2xl font-semibold text-black">Komentar</DialogTitle>

          {/* Input area */}
          <div className="rounded-xl border border-[#E0E0E1] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <MiniAvatar nama="A" />
              <span className="font-semibold text-base">Anda</span>
            </div>

            <textarea
              className="w-full text-sm text-black placeholder:text-gray-400 resize-none outline-none leading-relaxed min-h-[60px]"
              placeholder="Tulis komentar..."
              value={newKomentar}
              onChange={(e) => setNewKomentar(e.target.value)}
            />

            <div className="border-t border-black/10 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="p-1 hover:bg-gray-100 rounded transition">
                  <Bold className="size-4 text-black/40" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition">
                  <Italic className="size-4 text-black/40" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded transition">
                  <Link className="size-4 text-black/40" />
                </button>
              </div>
              <button
                onClick={() => setNewKomentar("")}
                className="px-5 py-2 bg-[#5088FF] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition active:scale-95"
              >
                Tambahkan Komentar
              </button>
            </div>
          </div>

          {/* Daftar komentar */}
          <div className="space-y-6">
            {komentarList.map((k) => (
              <div key={k.id} className="space-y-3">
                <div className="flex items-center gap-3">
                  <MiniAvatar nama={k.nama} />
                  <span className="font-semibold text-base">{k.nama}</span>
                </div>
                <p className="text-sm text-black/60 leading-relaxed">{k.teks}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button className="w-[30px] h-[30px] bg-[#F1F2F3] border border-[#E0E0E1] rounded flex items-center justify-center hover:bg-gray-200 transition">
                      <ThumbsUp className="size-4 text-[#777]" />
                    </button>
                    <button className="w-[30px] h-[30px] bg-[#F1F2F3] border border-[#E0E0E1] rounded flex items-center justify-center hover:bg-gray-200 transition">
                      <ThumbsDown className="size-4 text-[#777]" />
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-black/40">{k.waktu}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lihat lebih banyak */}
          <button className="w-full py-2.5 bg-[#F1F2F3] border border-[#E0E0E1] rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition">
            Lihat Lebih Banyak
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}