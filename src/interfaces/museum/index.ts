import { CuratorInterface } from 'interfaces/curator';
import { ExhibitInterface } from 'interfaces/exhibit';
import { OwnerInterface } from 'interfaces/owner';
import { VisitorInterface } from 'interfaces/visitor';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MuseumInterface {
  id?: string;
  description?: string;
  location?: string;
  opening_hours?: string;
  contact_number?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  curator?: CuratorInterface[];
  exhibit?: ExhibitInterface[];
  owner?: OwnerInterface[];
  visitor?: VisitorInterface[];
  user?: UserInterface;
  _count?: {
    curator?: number;
    exhibit?: number;
    owner?: number;
    visitor?: number;
  };
}

export interface MuseumGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  location?: string;
  opening_hours?: string;
  contact_number?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
