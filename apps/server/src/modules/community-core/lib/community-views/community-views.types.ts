import type { User } from '../../../../../generated';
import type { PlayerStats } from '../requirements';

export type AuthorUser = Pick<User, 'id' | 'image' | 'name'>;

export type AuthorView = {
  id: string;
  name: string;
  image: string | null;
};

export type StatsByAccount = ReadonlyMap<bigint, PlayerStats>;

export type NamesById = ReadonlyMap<bigint, string>;
