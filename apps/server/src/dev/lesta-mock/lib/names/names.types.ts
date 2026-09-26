import type { MockRng } from '../random';

export type UniqueNicknameInput = {
  rng: MockRng;
  taken: Set<string>;
};

export type ClanIdentity = {
  name: string;
  tag: string;
  motto: string;
  description: string;
  color: string;
};

export type ClanIdentityInput = {
  rng: MockRng;
  takenTags: Set<string>;
  parent?: Pick<ClanIdentity, 'name' | 'tag'>;
};
