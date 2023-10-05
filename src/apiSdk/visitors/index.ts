import queryString from 'query-string';
import { VisitorInterface, VisitorGetQueryInterface } from 'interfaces/visitor';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getVisitors = async (query?: VisitorGetQueryInterface): Promise<PaginatedInterface<VisitorInterface>> => {
  return fetcher('/api/visitors', {}, query);
};

export const createVisitor = async (visitor: VisitorInterface) => {
  return fetcher('/api/visitors', { method: 'POST', body: JSON.stringify(visitor) });
};

export const updateVisitorById = async (id: string, visitor: VisitorInterface) => {
  return fetcher(`/api/visitors/${id}`, { method: 'PUT', body: JSON.stringify(visitor) });
};

export const getVisitorById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/visitors/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteVisitorById = async (id: string) => {
  return fetcher(`/api/visitors/${id}`, { method: 'DELETE' });
};
