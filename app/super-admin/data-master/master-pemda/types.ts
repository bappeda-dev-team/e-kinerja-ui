// app/super-admin/data-master/master-pemda/types.ts

export interface MasterPemdaRequest {
    name: string;
}

export interface MasterPemda {
    id?: string;
    name?: string;
    logo?: string;
    created_at?: string;
    updated_at?: string;
}
