import queryString from 'query-string';
import { OwnerInterface, OwnerGetQueryInterface } from 'interfaces/owner';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getOwners = async (query?: OwnerGetQueryInterface): Promise<PaginatedInterface<OwnerInterface>> => {
  return fetcher('/api/owners', {}, query);
};

export const createOwner = async (owner: OwnerInterface) => {
  return fetcher('/api/owners', { method: 'POST', body: JSON.stringify(owner) });
};

export const updateOwnerById = async (id: string, owner: OwnerInterface) => {
  return fetcher(`/api/owners/${id}`, { method: 'PUT', body: JSON.stringify(owner) });
};

export const getOwnerById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/owners/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteOwnerById = async (id: string) => {
  return fetcher(`/api/owners/${id}`, { method: 'DELETE' });
};
