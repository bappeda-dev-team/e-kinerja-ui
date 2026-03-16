export interface VerifikasiRequest {
  laporan_id: string;
  komentar?: string;
  status_verified: string;
}

export interface VerifikasiResponse {
  id: string;
  laporan_id: string;
  status_verified: string;
  komentar?: string;
  created_at: string;
  updated_at: string;
  verifikator?: {
    full_name: string;
  };
  laporan?: {
    id: string;
    laporan_progress: string;
    permintaan?: {
      pemda: string;
      aplikasi: string;
      menu: string;
      tanggal_deadline: string;
    };
  };
}