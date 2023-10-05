import { UserInterface } from 'interfaces/user';
import { MuseumInterface } from 'interfaces/museum';
import { GetQueryInterface } from 'interfaces';

export interface CuratorInterface {
  id?: string;
  user_id: string;
  museum_id: string;
  specialization: string;
  experience: number;
  biography?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  museum?: MuseumInterface;
  _count?: {};
}

export interface CuratorGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  museum_id?: string;
  specialization?: string;
  biography?: string;
}
