export type DocumentStatus = 'ACTIVE' | 'DISABLED';

export interface Document {
  id: number;
  documentNumber: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsPagedResponse {
  content: Document[];
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
}
