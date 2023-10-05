import { UserInterface } from 'interfaces/user';
import { MuseumInterface } from 'interfaces/museum';
import { ExhibitInterface } from 'interfaces/exhibit';
import { GetQueryInterface } from 'interfaces';

export interface VisitorInterface {
  id?: string;
  user_id: string;
  visit_date: any;
  museum_id: string;
  exhibit_id: string;
  feedback?: string;
  rating?: number;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  museum?: MuseumInterface;
  exhibit?: ExhibitInterface;
  _count?: {};
}

export interface VisitorGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  museum_id?: string;
  exhibit_id?: string;
  feedback?: string;
}
