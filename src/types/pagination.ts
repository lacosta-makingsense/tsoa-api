export interface PaginationResponse<T> {
  count: number;
  // This should be defined as `T[]` instead but TSOA does not seem to like it
  items: T;
}

export type SortDirection = 'ASC' | 'DESC';

export interface PaginationParams {
  query?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export const SORT_DIRECTION_MAP = {
  ASC: 'ascending',
  DESC: 'descending'
};
