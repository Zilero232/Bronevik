import type { User } from '../../../../../generated';
import type { PlayerStats } from '../../lib/requirements';

export type AuthorUser = Pick<User, 'id' | 'image' | 'name'>;

export type StatsByAccount = ReadonlyMap<bigint, PlayerStats>;

export type NamesById = ReadonlyMap<bigint, string>;
