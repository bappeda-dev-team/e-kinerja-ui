// app/super-admin/data-master/master-roles/types.ts

export interface Roles {
    id?: string;
    name?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface RoleRequest {
    name: string;
    description: string;
}
