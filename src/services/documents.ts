import { apiClient } from '@/lib/apiClient';
import { DocumentsPagedResponse } from '@/types/document';

/**
 * Obtiene los documentos paginados
 */
export async function getDocumentsPaged(page: number, size: number) {
  const endpoint = `/admin/documents/paged?page=${page}&size=${size}`;
  return apiClient(endpoint, {
    method: 'GET',
  }) as Promise<DocumentsPagedResponse>;
}

/**
 * Crea un documento
 */
export async function createDocument(documentNumber: string) {
  const endpoint = `/admin/documents`;
  const body = JSON.stringify({ documentNumber, status: 'ACTIVE' });
  return apiClient(endpoint, { method: 'POST', body });
}

/**
 * Elimina un documento
 */
export async function deleteDocument(id: number) {
  const endpoint = `/admin/documents/${id}`;
  return apiClient(endpoint, { method: 'DELETE' });
}

/**
 * Activa un documento
 */
export async function activateDocument(id: number) {
  const endpoint = `/admin/documents/${id}/activate`;
  return apiClient(endpoint, { method: 'PUT' });
}

/**
 * Desactiva un documento
 */
export async function deactivateDocument(id: number) {
  const endpoint = `/admin/documents/${id}/deactivate`;
  return apiClient(endpoint, { method: 'PUT' });
}
