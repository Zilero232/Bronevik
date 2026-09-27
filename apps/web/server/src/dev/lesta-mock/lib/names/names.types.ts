import type { NICKNAME_PATTERN_WEIGHTS } from '../../config';
import type { MockRng } from '../random';

export type Pattern = keyof typeof NICKNAME_PATTERN_WEIGHTS;

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

export type CasingInput = {
  rng: MockRng;
  value: string;
};

export type BuildInput = {
  rng: MockRng;
  pattern: Pattern;
};

export type TagForInput = {
  rng: MockRng;
  name: string;
};
