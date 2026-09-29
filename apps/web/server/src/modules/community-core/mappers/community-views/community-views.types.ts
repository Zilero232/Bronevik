import type { z } from 'zod';

import type { User } from '../../../../../generated';
import type { authorSchema } from '../../dto/community-core.schemas';
import type { PlayerStats } from '../../lib/requirements';

export type AuthorUser = Pick<User, 'id' | 'image' | 'name'>;

export type AuthorView = z.infer<typeof authorSchema>;

export type StatsByAccount = ReadonlyMap<bigint, PlayerStats>;

export type NamesById = ReadonlyMap<bigint, string>;
