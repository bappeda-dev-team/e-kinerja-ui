import { Download, BookOpen } from "lucide-react"

const PANDUAN_URL = "https://drive.google.com/drive/folders/1vh_kj6CsFBtxMZ03ivl_Jp4YBs4pcjgP"

export function PanduanCard() {
  return (
    <div className="rounded-[20px] bg-white p-5 shadow-[6px_6px_54px_rgba(0,0,0,0.05)] flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50">
          <BookOpen className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#202224]">Download Panduan Website</p>
          <p className="text-xs text-[#202224]/50">(Manual User)</p>
        </div>
      </div>
      <a
        href={PANDUAN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#4880FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a6de0] transition-colors w-full"
      >
        <Download className="h-4 w-4" />
        Download
      </a>
    </div>
  )
}
