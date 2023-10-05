import { UserInterface } from 'interfaces/user';
import { MuseumInterface } from 'interfaces/museum';
import { GetQueryInterface } from 'interfaces';

export interface OwnerInterface {
  id?: string;
  user_id: string;
  museum_id: string;
  ownership_date: any;
  ownership_duration: number;
  ownership_status: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  museum?: MuseumInterface;
  _count?: {};
}

export interface OwnerGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  museum_id?: string;
  ownership_status?: string;
}
