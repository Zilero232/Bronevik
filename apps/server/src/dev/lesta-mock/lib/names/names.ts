import transliterate from '@sindresorhus/transliterate';

import type { MockRng } from '../random';
import type { ClanIdentity, ClanIdentityInput, UniqueNicknameInput } from './names.types';

import { CLAN_PHRASES, CLAN_WORDS, NICKNAME_PATTERN_WEIGHTS, NICKNAME_RULES, NICKNAME_WORDS } from '../../config';

type Pattern = keyof typeof NICKNAME_PATTERN_WEIGHTS;

const PATTERNS = Object.keys(NICKNAME_PATTERN_WEIGHTS).filter((key): key is Pattern => key in NICKNAME_PATTERN_WEIGHTS);

const digits = (rng: MockRng): string =>
  rng.weighted([1, 2, 3, 4], (length) => [0, 0.2, 0.45, 0.2, 0.15][length] ?? 0) === 4
    ? String(rng.int(NICKNAME_RULES.birthYears[0], NICKNAME_RULES.birthYears[1]))
    : String(rng.int(1, 999));

const year = (rng: MockRng): string => {
  const value = rng.int(NICKNAME_RULES.birthYears[0], NICKNAME_RULES.birthYears[1]);

  return rng.chance(0.3) ? String(value).slice(2) : String(value);
};

const separator = (rng: MockRng): string => (rng.chance(0.45) ? '_' : '');

const casing = (rng: MockRng, value: string): string => {
  const roll = rng.float();

  if (roll < 0.14) {
    return value.toLowerCase();
  }

  if (roll < 0.19) {
    return value.toUpperCase();
  }

  return value;
};

const LEET: ReadonlyMap<string, string> = new Map(Object.entries(NICKNAME_RULES.leet));

const leet = (value: string): string => [...value].map((char) => LEET.get(char.toLowerCase()) ?? char).join('');

const build = (rng: MockRng, pattern: Pattern): string => {
  const words = NICKNAME_WORDS;

  switch (pattern) {
    case 'adjectiveNoun':
      return casing(
        rng,
        `${rng.pick(words.adjectives)}${separator(rng)}${rng.pick(words.nouns)}${rng.chance(0.5) ? separator(rng) + digits(rng) : ''}`
      );
    case 'nameSurname':
      return casing(rng, `${rng.pick(words.names)}${separator(rng)}${rng.pick(words.surnames)}${rng.chance(0.25) ? year(rng) : ''}`);
    case 'nameYear':
      return casing(rng, `${rng.pick(words.names)}${separator(rng)}${year(rng)}`);
    case 'russian':
      return casing(
        rng,
        rng.chance(0.5)
          ? `${rng.pick(words.russian)}${separator(rng)}${rng.chance(0.5) ? rng.pick(words.suffixes) : digits(rng)}`
          : `${rng.pick(words.adjectives)}${separator(rng)}${rng.pick(words.russian)}`
      );
    case 'surnameDigits':
      return casing(rng, `${rng.pick(words.surnames)}${separator(rng)}${digits(rng)}`);
    case 'tank':
      return rng.chance(0.5)
        ? `${rng.pick(words.names)}_na_${rng.pick(words.tanks)}`
        : `${rng.pick(words.tanks)}${separator(rng)}${rng.pick(words.nouns)}`;
    case 'decorated': {
      const core = `${rng.pick(words.adjectives)}${rng.pick(words.nouns)}`;

      return rng.chance(0.5) ? `xX_${core}_Xx` : `_${core}_`;
    }

    case 'caps':
      return `${rng.pick(words.russian).toUpperCase()}${rng.chance(0.5) ? `_${rng.pick(words.suffixes).toUpperCase()}` : String(rng.int(1, 99))}`;
    case 'mash':
      return `${rng.pick(words.mash)}${rng.chance(0.5) ? rng.pick(words.mash) : ''}${digits(rng)}`;
    case 'leet':
      return leet(`${rng.pick(words.adjectives)}_${rng.pick(words.nouns)}`);
    case 'nameCity':
      return `${rng.pick(words.names).toLowerCase()}_${rng.pick(words.cities)}${rng.chance(0.4) ? digits(rng) : ''}`;
  }
};

const clean = (value: string): string => value.replaceAll(/\W/g, '').slice(0, NICKNAME_RULES.maxLength).padEnd(NICKNAME_RULES.minLength, '_');

export const uniqueNickname = ({ rng, taken }: UniqueNicknameInput): string => {
  const pattern = rng.weighted(PATTERNS, (key) => NICKNAME_PATTERN_WEIGHTS[key]);
  let nickname = clean(build(rng, pattern));

  while (taken.has(nickname.toLowerCase())) {
    nickname = clean(`${nickname.slice(0, NICKNAME_RULES.maxLength - 3)}${rng.int(1, 999)}`);
  }

  taken.add(nickname.toLowerCase());

  return nickname;
};

const initials = (name: string): string =>
  transliterate(name)
    .toUpperCase()
    .replaceAll(/[^A-Z0-9 ]/g, '')
    .split(' ')
    .filter((word) => word.length > 0)
    .map((word) => word.slice(0, word.length > 6 ? 2 : 1))
    .join('');

const tagFor = (rng: MockRng, name: string): string => {
  const base = initials(name).slice(0, 4);
  const roll = rng.float();

  if (base.length < 2 || roll < 0.25) {
    return transliterate(name)
      .toUpperCase()
      .replaceAll(/[^A-Z]/g, '')
      .slice(0, rng.int(3, 5));
  }

  if (roll < 0.45) {
    return `${base}${rng.int(1, 9)}`.slice(0, 5);
  }

  if (roll < 0.55) {
    return `_${base}_`.slice(0, 5);
  }

  return base;
};

const clanName = (rng: MockRng): string => {
  const roll = rng.float();

  if (roll < 0.4) {
    return `${rng.pick(CLAN_WORDS.ruAdjectives)} ${rng.pick(CLAN_WORDS.ruNouns)}`;
  }

  if (roll < 0.62) {
    return rng.pick(CLAN_WORDS.ruTemplates).replace('{0}', rng.pick(CLAN_WORDS.ruSingles)).replace('{1}', rng.pick(CLAN_WORDS.ruGenitive));
  }

  if (roll < 0.9) {
    return `${rng.pick(CLAN_WORDS.enAdjectives)} ${rng.pick(CLAN_WORDS.enNouns)}`;
  }

  return rng.pick(CLAN_WORDS.ruSingles);
};

const description = (rng: MockRng): string => {
  const requirement = rng
    .pick(CLAN_PHRASES.requirements)
    .replace('{wn8}', String(rng.pick([900, 1200, 1500, 1800, 2200])))
    .replace('{battles}', String(rng.pick([3000, 5000, 8000, 10_000, 15_000])))
    .replace('{wr}', String(rng.pick([49, 50, 52, 54])));

  return [requirement, rng.pick(CLAN_PHRASES.activities), rng.pick(CLAN_PHRASES.contacts)].join('\n');
};

export const clanIdentity = ({ rng, takenTags, parent }: ClanIdentityInput): ClanIdentity => {
  const name = parent ? `${parent.name} ${rng.pick(CLAN_WORDS.academy)}` : clanName(rng);
  let tag = parent ? `${parent.tag.slice(0, 3)}-${rng.pick(['A', 'R', 'S'])}` : tagFor(rng, name);

  while (tag.length < 2 || takenTags.has(tag)) {
    tag = `${tag.replaceAll(/\d+$/g, '').slice(0, 3)}${rng.int(1, 99)}`.slice(0, 5);
  }

  takenTags.add(tag);

  return { name, tag, motto: rng.pick(CLAN_PHRASES.mottos), description: description(rng), color: rng.pick(CLAN_WORDS.colors) };
};
