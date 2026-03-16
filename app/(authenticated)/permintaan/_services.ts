// _services.ts
import { fetchApi } from "@/lib/fetcher";
import { APIResponse } from "@/types/api";
import { PermintaanRequest, PermintaanResponse } from "./_types";
import { getSession } from "next-auth/react";

/**
 * Mendapatkan semua data permintaan
 */
export const getPermintaan = async () => {
  return fetchApi<APIResponse<PermintaanResponse[]>>("/permintaan", { method: "GET" });
};

/**
 * Mendapatkan detail permintaan berdasarkan ID
 */
export const getPermintaanById = async (id: string) => {
  return fetchApi<APIResponse<PermintaanResponse>>(`/permintaan/${id}`, { method: "GET" });
};

/**
 * Membuat permintaan baru (Data Teks)
 */
export const createPermintaan = async (data: PermintaanRequest) => {
  return fetchApi<APIResponse<PermintaanResponse>>("/permintaan", { 
    method: "POST", 
    body: data 
  });
};

/**
 * Memperbarui data permintaan (Data Teks)
 */
export const updatePermintaan = async (id: string, data: PermintaanRequest) => {
  return fetchApi<APIResponse<PermintaanResponse>>(`/permintaan/${id}`, { 
    method: "PUT", 
    body: data 
  });
};

/**
 * Menghapus data permintaan
 */
export const deletePermintaan = async (id: string) => {
  return fetchApi<APIResponse<any>>(`/permintaan/${id}`, { method: "DELETE" });
};

/**
 * FUNGSI UNGGAH LAMPIRAN (PATCH)
 * Sesuai dokumentasi Postman: {{base_url}}/permintaan/{{id_permintaan}}/lampiran
 */
export const uploadPermintaanAttachment = async (id: string, files: File[]) => {
  // 1. Ambil Session untuk mendapatkan Bearer Token
  const session = await getSession();
  const token = (session as any)?.accessToken;

  if (!token) {
    throw new Error("Sesi habis atau token tidak ditemukan. Silakan login kembali.");
  }

  // 2. Siapkan FormData
  const formData = new FormData();
  
  // Masukkan semua file ke dalam FormData
  // Note: Pastikan key "files" sesuai dengan yang diharapkan backend kamu
  files.forEach((file) => {
    formData.append("files", file); 
  });

  // 3. Eksekusi Fetch Manual (Karena menggunakan FormData)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/permintaan/${id}/lampiran`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`, // Masukkan Bearer Token ke Header
    },
    body: formData,
  });

  // 4. Handle Response
  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(resData.message || "Gagal mengunggah lampiran. Pastikan ID Permintaan benar.");
  }

  return resData;
};