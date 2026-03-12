export interface LaporanRequest {
    laporan_progress: string;
    permintaan_id: string;
}

export interface LaporanResponse {
    id?: string;
    created_at?: string;
    laporan_progress?: string;
    permintaan_id?: string;
    programmer_id?: string;
    updated_at?: string;
    
    // relation if any
    permintaan?: any;
    programmer?: any;
}
