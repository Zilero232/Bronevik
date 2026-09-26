import type { Loadout } from '@otmetki/schemas';

export type BuildHrefInput = {
  slug: string;
  loadout: Loadout;
  compare?: Loadout;
};

export type ToSlotsInput = {
  raw: string | undefined;
  size: number;
};
