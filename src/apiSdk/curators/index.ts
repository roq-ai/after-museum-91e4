import queryString from 'query-string';
import { CuratorInterface, CuratorGetQueryInterface } from 'interfaces/curator';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getCurators = async (query?: CuratorGetQueryInterface): Promise<PaginatedInterface<CuratorInterface>> => {
  return fetcher('/api/curators', {}, query);
};

export const createCurator = async (curator: CuratorInterface) => {
  return fetcher('/api/curators', { method: 'POST', body: JSON.stringify(curator) });
};

export const updateCuratorById = async (id: string, curator: CuratorInterface) => {
  return fetcher(`/api/curators/${id}`, { method: 'PUT', body: JSON.stringify(curator) });
};

export const getCuratorById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/curators/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteCuratorById = async (id: string) => {
  return fetcher(`/api/curators/${id}`, { method: 'DELETE' });
};
