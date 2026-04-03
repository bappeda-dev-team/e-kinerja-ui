// data/dummy-distribusi.ts

import { dummyPermintaan } from "./dummy-permintaan"

export const dummyDistribusi = [
  {
    id: "DIST001",
    permintaan_id: dummyPermintaan[0].id,
    admin: "Maura",
    pelaksana: ["ASEP SURYANA"],
    komentar_admin: "Prioritas tinggi",
    created_at: "2025-03-05",
  },
  {
    id: "DIST002",
    permintaan_id: dummyPermintaan[0].id,
    admin: "Maura",
    pelaksana: ["RIZKY MAULANA", "LINA WULANDARI"],
    komentar_admin: "Deadline ketat",
    created_at: "2025-03-06",
  },
]