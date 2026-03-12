export interface DistribusiRequest {
    komentar?: string;
    permintaan_id: string;
}

export interface DistribusiResponse {
    id?: string;
    admin_id?: string;
    komentar?: string;
    permintaan_id?: string;
    created_at?: string;
    updated_at?: string;
    
    // relations if any
    permintaan?: any;
    admin?: any;
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
