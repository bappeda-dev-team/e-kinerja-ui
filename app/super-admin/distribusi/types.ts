// app/super-admin/distribusi/types.ts

// ─── Shared sub-types ─────────────────────────────────────
export interface NamedEntity {
    id: string;
    name: string;
    logo?: string;
}

export interface UserRef {
    id: string;
    username: string;
    full_name: string;
    profile_picture?: string;
}

// ─── Permintaan ───────────────────────────────────────────
export interface PermintaanResponse {
    id: string;
    pemda: NamedEntity;          // { id, name }
    aplikasi: NamedEntity;       // { id, name }
    menu: string;
    kondisi_awal?: string;
    kondisi_diharapkan?: string;
    tanggal_pesanan?: string;
    tanggal_deadline?: string;
    lampiran?: string[];
    pembuat?: UserRef;
    created_at?: string;
    updated_at?: string;
}

// ─── Distribusi ───────────────────────────────────────────
export interface DistribusiRequest {
    komentar?: string;
    permintaan_id: string;
    programmer_ids: string[];
    deadline?: string;
}

export interface UpdateDistribusiRequest {
    komentar?: string;
    permintaan_id: string;
    pelaksana: string[];
    deadline?: string;
}

export interface DistribusiPermintaan {
    id: string;
    pemda: NamedEntity | string;   // toleran: bisa object atau string
    aplikasi: NamedEntity | string;
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
    profile_picture?: string;
}

export interface DistribusiPelaksana {
    id: string;
    username: string;
    full_name: string;
    profile_picture?: string;
}

export interface DistribusiResponse {
    id: string;
    permintaan?: DistribusiPermintaan;
    admin?: DistribusiAdmin;
    pelaksana?: DistribusiPelaksana[];
    verifikasi?: {
        id: string;
        komentar?: string;
        status_verified?: string;
    };
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
    programmer?: unknown;
}

// ─── Users ────────────────────────────────────────────────
export interface UserResponse {
    id: string;
    role_id: string;
    role?: {
        id?: string;
        name?: string;
        description?: string;
    } | string;
    username: string;
    full_name: string;
    profile_picture?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}
