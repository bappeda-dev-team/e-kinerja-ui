// app/super-admin/verifikasi/_types.ts

export interface VerifikasiRequest {
  laporan_id: string;
  komentar?: string;
  status_verified: string;
}

export interface VerifikasiResponse {
  id: string;
  status_verified: string;
  komentar?: string;
  created_at: string;
  updated_at: string;
  verifikator?: {
    id?: string;
    username?: string;
    full_name: string;
  };
  laporan?: {
    id: string;
    laporan_progress: string;
    status?: string;
    programmer?: {
      id?: string;
      username?: string;
      full_name: string;
    };
  };
}
