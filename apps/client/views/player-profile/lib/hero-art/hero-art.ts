import type { PageHeroArt } from '@/ui-kit';

import type { HeroArtInput } from './hero-art.types';

import { topNation } from '../top-nation';

export const heroArt = ({ clan, rows }: HeroArtInput): PageHeroArt | undefined => {
  if (clan?.emblem) {
    return { kind: 'clan', emblem: clan.emblem };
  }

  const nation = topNation(rows);

  return nation ? { kind: 'flag', nation } : undefined;
};
