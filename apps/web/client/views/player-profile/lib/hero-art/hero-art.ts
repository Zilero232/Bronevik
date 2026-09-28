import type { PageHeroArt } from '@/ui-kit';

import { vehicleIdentity } from '@/entities/tank/tank';

import type { HeroArtInput } from './hero-art.types';

import { PROFILE_HEADER } from '../../config';
import { favoriteTanks } from '../favorite-tanks';
import { topNation } from '../top-nation';

export const heroArt = ({ clan, rows }: HeroArtInput): PageHeroArt | undefined => {
  if (clan?.emblem) {
    return { kind: 'clan', emblem: clan.emblem };
  }

  const favorites = favoriteTanks({ rows, count: PROFILE_HEADER.heroTanks });

  if (favorites.length > 0) {
    return { kind: 'tanks', tanks: favorites.map(({ vehicle }) => vehicleIdentity(vehicle)) };
  }

  const nation = topNation(rows);

  return nation ? { kind: 'flag', nation } : undefined;
};
