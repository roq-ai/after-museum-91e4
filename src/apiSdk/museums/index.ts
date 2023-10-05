import queryString from 'query-string';
import { MuseumInterface, MuseumGetQueryInterface } from 'interfaces/museum';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getMuseums = async (query?: MuseumGetQueryInterface): Promise<PaginatedInterface<MuseumInterface>> => {
  return fetcher('/api/museums', {}, query);
};

export const createMuseum = async (museum: MuseumInterface) => {
  return fetcher('/api/museums', { method: 'POST', body: JSON.stringify(museum) });
};

export const updateMuseumById = async (id: string, museum: MuseumInterface) => {
  return fetcher(`/api/museums/${id}`, { method: 'PUT', body: JSON.stringify(museum) });
};

export const getMuseumById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/museums/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteMuseumById = async (id: string) => {
  return fetcher(`/api/museums/${id}`, { method: 'DELETE' });
};
