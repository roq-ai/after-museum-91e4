import queryString from 'query-string';
import { ExhibitInterface, ExhibitGetQueryInterface } from 'interfaces/exhibit';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getExhibits = async (query?: ExhibitGetQueryInterface): Promise<PaginatedInterface<ExhibitInterface>> => {
  return fetcher('/api/exhibits', {}, query);
};

export const createExhibit = async (exhibit: ExhibitInterface) => {
  return fetcher('/api/exhibits', { method: 'POST', body: JSON.stringify(exhibit) });
};

export const updateExhibitById = async (id: string, exhibit: ExhibitInterface) => {
  return fetcher(`/api/exhibits/${id}`, { method: 'PUT', body: JSON.stringify(exhibit) });
};

export const getExhibitById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/exhibits/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteExhibitById = async (id: string) => {
  return fetcher(`/api/exhibits/${id}`, { method: 'DELETE' });
};
