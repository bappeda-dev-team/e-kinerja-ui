export interface VerifikasiRequest {
    komentar?: string;
    laporan_id: string;
    status_verified: string;
}

export interface VerifikasiResponse {
    id?: string;
    created_at?: string;
    komentar?: string;
    laporan_id?: string;
    status_verified?: string;
    updated_at?: string;
    verifikator_id?: string;
    
    // relation if any
    laporan?: any;
    verifikator?: any;
}
