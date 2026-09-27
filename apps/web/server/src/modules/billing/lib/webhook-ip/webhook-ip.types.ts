import type { BlockList } from 'node:net';

export type AllowListInput = {
  list: BlockList;
  ip: string;
};
