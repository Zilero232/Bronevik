import type { MockPlayer } from '@/shared/mocks';

import { seededRandom } from '@/shared/lib';
import { MOCK_PLAYERS } from '@/shared/mocks';

import type { SynthesizeInput } from './mock.types';

import { NotFoundError } from '../../source/source.errors';
import { clamp, hashString, round } from './mock.helpers';

const MISSING = /nobody|^404$|notfound/i;

const SYNTH = {
  idBase: 20_000_000,
  idRange: 9_000_000
} as const;

const cache = new Map<number, MockPlayer>(MOCK_PLAYERS.map((player) => [player.id, player]));

const synthesize = ({ id, nickname }: SynthesizeInput): MockPlayer => {
  const random = seededRandom(id);
  const skill = random();
  const wn8 = round(420 + skill * 2500);
  const battles = round(3_000 + random() * 45_000);

  return {
    id,
    nickname,
    clanTag: random() > 0.4 ? ['KOPTE', 'RED', 'STEEL', 'VETER', 'MEOW', 'BOOM'][Math.floor(random() * 6)] : null,
    battles,
    winRate: round(clamp(46 + skill * 17, 44, 68), 2),
    wn8,
    avgDamage: round(900 + skill * 2300),
    broneIndex: round(2_000 + skill * 7_600),
    marks3: round(skill * skill * 180),
    masters: round(battles / 90),
    favoriteTank: 'ИС-7',
    trend: Array.from({ length: 30 }, () => round(wn8 * (0.92 + random() * 0.16)))
  };
};

const remember = (player: MockPlayer) => {
  cache.set(player.id, player);

  return player;
};

export const mockPlayerById = (id: number): MockPlayer => cache.get(id) ?? remember(synthesize({ id, nickname: `Tanker_${id % 100_000}` }));

export const mockPlayerByLookup = (idOrNick: string): MockPlayer => {
  const lookup = idOrNick.trim();

  if (MISSING.test(lookup)) {
    throw new NotFoundError(lookup);
  }

  if (/^\d+$/.test(lookup)) {
    return mockPlayerById(Number(lookup));
  }

  const known = [...cache.values()].find(({ nickname }) => nickname.toLowerCase() === lookup.toLowerCase());

  return known ?? remember(synthesize({ id: SYNTH.idBase + (hashString(lookup) % SYNTH.idRange), nickname: lookup }));
};
