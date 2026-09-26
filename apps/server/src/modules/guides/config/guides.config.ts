import { AUTHOR_SELECT } from '../../community-core';

export const GUIDES = {
  maxBodyLength: 50_000,
  authorsLimit: 20,
  mineLimit: 200
} as const;

export const COMMENTS = {
  maxBodyLength: 4000,
  pageLimit: 100
} as const;

export const GUIDE_INCLUDE = { author: { select: AUTHOR_SELECT } } as const;
