// app/super-admin/data-master/master-aplikasi/types.ts

export interface CreateMasterAplikasiRequest {
    name: string
    link?: string
}

export interface MasterAplikasi {
    id?: string;
    name?: string;
    logo?: string;
    link?: string;
    created_at?: string;
    updated_at?: string;
}
