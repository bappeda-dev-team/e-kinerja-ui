// Mock data untuk penugasan dan laporan — digunakan sementara sebelum backend siap

export type LaporanStatus = "pending" | "revision" | "approved"

export interface MockPermintaan {
  id: string
  pemda: string
  aplikasi: string
  menu: string
  tanggal_deadline: string
}

export interface MockLaporan {
  id: string
  penugasan_id: string
  permintaan_id: string
  laporan_progress: string
  status_progress: number // 0 | 25 | 50 | 75 | 100
  status: LaporanStatus
  is_sent: boolean
  catatan_revisor?: string
  created_at: string
  updated_at: string
}

// ─── Mock Permintaan ──────────────────────────────────────────────────────────
export const MOCK_PERMINTAAN: MockPermintaan[] = [
  {
    id: "permintaan-001",
    pemda: "Kota Bandung",
    aplikasi: "SIPD",
    menu: "Modul Keuangan",
    tanggal_deadline: "2026-05-10T00:00:00Z",
  },
  {
    id: "permintaan-002",
    pemda: "Kabupaten Bogor",
    aplikasi: "e-Absensi",
    menu: "Rekap Kehadiran",
    tanggal_deadline: "2026-04-28T00:00:00Z",
  },
  {
    id: "permintaan-003",
    pemda: "Kota Depok",
    aplikasi: "e-Kinerja",
    menu: "Laporan Kinerja ASN",
    tanggal_deadline: "2026-06-01T00:00:00Z",
  },
  {
    id: "permintaan-004",
    pemda: "Kabupaten Bekasi",
    aplikasi: "SIMDA",
    menu: "Aset Daerah",
    tanggal_deadline: "2026-05-20T00:00:00Z",
  },
]

// ─── Mock Penugasan (distribusi_pelaksana) ────────────────────────────────────
// Menggunakan tipe PenugasanItem dari penugasan/types.ts
export const MOCK_PENUGASAN_IDS = {
  P1: "penugasan-001",
  P2: "penugasan-002",
  P3: "penugasan-003",
  P4: "penugasan-004",
}

// Mapping penugasan_id → permintaan_id (karena penugasan berasal dari distribusi
// yang merujuk ke permintaan)
export const PENUGASAN_PERMINTAAN_MAP: Record<string, string> = {
  "penugasan-001": "permintaan-001",
  "penugasan-002": "permintaan-002",
  "penugasan-003": "permintaan-003",
  "penugasan-004": "permintaan-004",
}

// ─── Mock Laporan ─────────────────────────────────────────────────────────────
export const MOCK_LAPORAN: MockLaporan[] = [
  // Penugasan 1: 2 laporan
  {
    id: "laporan-001",
    penugasan_id: "penugasan-001",
    permintaan_id: "permintaan-001",
    laporan_progress:
      "Sudah menyelesaikan desain database untuk modul keuangan. ERD sudah dibuat dan disetujui oleh tim.",
    status_progress: 25,
    status: "approved",
    is_sent: true,
    created_at: "2026-04-01T08:00:00Z",
    updated_at: "2026-04-03T10:00:00Z",
  },
  {
    id: "laporan-002",
    penugasan_id: "penugasan-001",
    permintaan_id: "permintaan-001",
    laporan_progress:
      "Implementasi API endpoint untuk CRUD transaksi keuangan. Sudah ada unit test untuk 8 endpoint.",
    status_progress: 50,
    status: "revision",
    is_sent: true,
    catatan_revisor:
      "Tolong tambahkan validasi input pada endpoint POST /transaksi dan pastikan response format sesuai standar API.",
    created_at: "2026-04-05T09:00:00Z",
    updated_at: "2026-04-07T14:00:00Z",
  },

  // Penugasan 2: 1 laporan sudah dikirim, belum diverifikasi
  {
    id: "laporan-003",
    penugasan_id: "penugasan-002",
    permintaan_id: "permintaan-002",
    laporan_progress:
      "Membuat halaman rekap kehadiran dengan filter bulan dan unit kerja. Fitur export ke Excel sudah berjalan.",
    status_progress: 75,
    status: "pending",
    is_sent: true,
    created_at: "2026-04-08T11:00:00Z",
    updated_at: "2026-04-08T11:00:00Z",
  },

  // Penugasan 3: 1 laporan draft (belum dikirim)
  {
    id: "laporan-004",
    penugasan_id: "penugasan-003",
    permintaan_id: "permintaan-003",
    laporan_progress:
      "Baru mulai menganalisis kebutuhan fitur laporan kinerja ASN. Sudah diskusi dengan stakeholder.",
    status_progress: 25,
    status: "pending",
    is_sent: false,
    created_at: "2026-04-10T13:00:00Z",
    updated_at: "2026-04-10T13:00:00Z",
  },

  // Penugasan 4: belum ada laporan (kosong, tidak perlu entry di sini)
]

// ─── Mock deadline fallback (untuk data real dari API yang belum ada deadline) ─
// Key: distribusi_id atau penugasan_id dari API, value: tanggal deadline mock
export const MOCK_DEADLINE_FALLBACK = "2026-05-30T00:00:00Z"

// ─── Helper ───────────────────────────────────────────────────────────────────
export function getLaporanByPenugasan(penugasanId: string, laporan: MockLaporan[]): MockLaporan[] {
  return laporan
    .filter((l) => l.penugasan_id === penugasanId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getPermintaanByPenugasan(penugasanId: string): MockPermintaan | undefined {
  const permintaanId = PENUGASAN_PERMINTAAN_MAP[penugasanId]
  return MOCK_PERMINTAAN.find((p) => p.id === permintaanId)
}
