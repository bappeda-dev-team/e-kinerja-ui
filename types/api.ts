export interface APIResponse<T = any> {
    code?: number;
    data?: T;
    errors?: any;
    message?: string;
    success?: boolean;
}
