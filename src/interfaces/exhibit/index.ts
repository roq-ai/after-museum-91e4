import { VisitorInterface } from 'interfaces/visitor';
import { MuseumInterface } from 'interfaces/museum';
import { GetQueryInterface } from 'interfaces';

export interface ExhibitInterface {
  id?: string;
  name: string;
  origin: string;
  age: number;
  description?: string;
  museum_id: string;
  created_at?: any;
  updated_at?: any;
  visitor?: VisitorInterface[];
  museum?: MuseumInterface;
  _count?: {
    visitor?: number;
  };
}

export interface ExhibitGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  origin?: string;
  description?: string;
  museum_id?: string;
}
