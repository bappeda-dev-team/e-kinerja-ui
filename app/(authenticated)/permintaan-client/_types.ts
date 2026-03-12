export interface PermintaanRequest {
    aplikasi_id: string;
    kondisi_awal: string;
    kondisi_diharapkan: string;
    menu: string;
    pemda_id: string;
    tanggal_deadline: string;
    tanggal_pesanan: string;
}

export interface PermintaanResponse {
    id?: string;
    aplikasi_id?: string;
    created_at?: string;
    created_by?: string;
    kondisi_awal?: string;
    kondisi_diharapkan?: string;
    menu?: string;
    pemda_id?: string;
    tanggal_deadline?: string;
    tanggal_pesanan?: string;
    updated_at?: string;
    
    // expand relational objects (optional)
    pemda?: any;
    aplikasi?: any;
    pembuat?: any;
}
