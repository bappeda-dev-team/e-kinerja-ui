
export interface VerifikasiRequest {
  laporan_id: string;
  komentar?: string;
  status_verified: string;
}

export interface VerifikasiResponse {
  id: string;
  distribusi_id?: string;
  status_verified: string;
  komentar?: string | null;
  created_at: string;
  updated_at: string;
  verifikator?: {
    id?: string;
    username?: string;
    full_name: string;
    profile_picture?: string;
  };
  laporan?: {
    id: string;
    laporan_progress: string;
    status?: string;
    programmer?: {
      id?: string;
      username?: string;
      full_name: string;
      profile_picture?: string;
    };
  };
  permintaan?: {
    id: string;
    pemda?: { id: string; name: string; logo?: string };
    aplikasi?: { id: string; name: string; logo?: string };
    menu?: string;
    kondisi_awal?: string;
    kondisi_diharapkan?: string;
    tanggal_pesanan?: string;
    tanggal_deadline?: string;
    lampiran?: string[];
  };
}

export interface SubmitVerifikasiResponse {
  laporan_id?: string;
  is_submitted_to_verified?: boolean;
  verifikasi?: VerifikasiResponse | null;
}
