import { apiClient } from '@/lib/apiClient';

export type ApiDocument = {
  id: number;
  documentNumber: string;
  status: 'ACTIVE' | 'DISABLED' | string;
  createdAt: string;
  updatedAt: string;
};

export type DocumentsPagedResponse = {
  content: ApiDocument[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
};

export async function getDocumentsPaged(page: number, size: number) {
  const endpoint = `/admin/documents/paged?page=${page}&size=${size}`;
  return apiClient(endpoint, {
    method: 'GET',
  }) as Promise<DocumentsPagedResponse>;
}

export async function createDocument(documentNumber: string) {
  const endpoint = `/admin/documents`;
  const body = JSON.stringify({ documentNumber, status: 'ACTIVE' });
  return apiClient(endpoint, { method: 'POST', body });
}

export async function deleteDocument(id: number) {
  const endpoint = `/admin/documents/${id}`;
  return apiClient(endpoint, { method: 'DELETE' });
}

export async function activateDocument(id: number) {
  const endpoint = `/admin/documents/${id}/activate`;
  return apiClient(endpoint, { method: 'PUT' });
}

export async function deactivateDocument(id: number) {
  const endpoint = `/admin/documents/${id}/deactivate`;
  return apiClient(endpoint, { method: 'PUT' });
}
