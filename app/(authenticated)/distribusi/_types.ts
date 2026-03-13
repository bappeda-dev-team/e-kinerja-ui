export interface DistribusiRequest {
    komentar?: string;
    permintaan_id: string;
}

export interface DistribusiPermintaan {
    id: string;
    pemda: string;
    aplikasi: string;
    menu: string;
    kondisi_awal?: string;
    kondisi_diharapkan?: string;
    tanggal_pesanan?: string;
    tanggal_deadline?: string;
    lampiran?: string[];
}

export interface DistribusiAdmin {
    id: string;
    username: string;
    full_name: string;
}

export interface DistribusiResponse {
    id: string;
    permintaan?: DistribusiPermintaan;
    admin?: DistribusiAdmin;
    komentar?: string;
    created_at?: string;
    updated_at?: string;
}

export interface PelaksanaRequest {
    distribusi_id: string;
    programmer_id: string;
}

export interface PelaksanaResponse {
    id?: string;
    distribusi_id?: string;
    programmer_id?: string;
    created_at?: string;
    updated_at?: string;
    
    // relations if any
    programmer?: any;
}
