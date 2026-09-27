import type { BuildMode } from '@otmetki/schemas';

import { BUILD_USAGE } from '@otmetki/schemas';
import { countBy, entries, groupBy, isNonNullish, sortBy, sumBy, unique, uniqueBy } from 'remeda';

import type {
  AddPickInput,
  GroupUsageInput,
  InCohortInput,
  PickAccumulator,
  RoleAccumulator,
  ShellAccumulator,
  StoredBuildUsage,
  ToPicksInput,
  UsageGroup,
  UsageSample,
  UsageSummary
} from './build-usage.types';

import { percentOf, ratio } from '../../../../../common/lib';
import { BUILD_MODE_BONUS_TYPES, BUILD_USAGE_AGGREGATE, BUILD_USAGE_SHARE } from './build-usage.constants';

const MODE_BY_BONUS_TYPE = new Map<string, BuildMode>(
  entries(BUILD_MODE_BONUS_TYPES).flatMap(([mode, types]) => types.map((type) => [String(type), mode] as const))
);

const share = (value: number): number => Math.min(1, Math.round(value * BUILD_USAGE_SHARE.digits) / BUILD_USAGE_SHARE.digits);

const emptyPick = (): PickAccumulator => ({ weight: 0, battles: 0, wins: 0, decided: 0, damage: 0 });

export const modeOfBonusType = (battleType: string): BuildMode | null => MODE_BY_BONUS_TYPE.get(battleType) ?? null;

export const bonusTypesOf = (mode: BuildMode): string[] => BUILD_MODE_BONUS_TYPES[mode].map(String);

const addPick = ({ picks, key, sample, weight }: AddPickInput): void => {
  const pick = picks.get(key) ?? emptyPick();

  pick.weight += weight;
  pick.battles += 1;
  pick.damage += sample.damage;

  if (sample.won !== null) {
    pick.decided += 1;
    pick.wins += sample.won ? 1 : 0;
  }

  picks.set(key, pick);
};

const toPicks = ({ picks, players }: ToPicksInput) =>
  sortBy(
    [...picks.entries()].map(([key, pick]) => ({
      key,
      battles: pick.battles,
      share: players > 0 ? share(pick.weight / players) : 0,
      winRate: percentOf({ value: pick.wins, by: pick.decided }),
      avgDamage: ratio({ value: pick.damage, by: pick.battles })
    })),
    [(pick) => pick.share, 'desc'],
    [(pick) => pick.battles, 'desc']
  ).slice(0, BUILD_USAGE_AGGREGATE.maxPicks);

const idPicks = (input: ToPicksInput) => toPicks(input).map(({ key, ...pick }) => ({ id: Number(key), ...pick }));

const presentIds = (ids: readonly (number | null)[]): number[] => unique(ids.filter(isNonNullish));

export const summarizeUsage = (samples: readonly UsageSample[]): UsageSummary => {
  const battlesOf = countBy(samples, (sample) => sample.accountId);
  const players = Object.keys(battlesOf).length;
  const slots = new Map<number, Map<string, PickAccumulator>>();
  const consumables = new Map<string, PickAccumulator>();
  const directives = new Map<string, PickAccumulator>();
  const fieldModifications = new Map<string, PickAccumulator>();
  const shells = new Map<number, ShellAccumulator>();
  const crew = new Map<string, RoleAccumulator>();
  let shellWeight = 0;

  for (const sample of samples) {
    const weight = 1 / (battlesOf[sample.accountId] ?? 1);
    const { loadout } = sample;

    loadout.optionalDevices.forEach((id, slot) => {
      if (id === null) {
        return;
      }

      const picks = slots.get(slot) ?? new Map<string, PickAccumulator>();

      addPick({ picks, key: String(id), sample, weight });
      slots.set(slot, picks);
    });

    for (const id of presentIds(loadout.consumables)) {
      addPick({ picks: consumables, key: String(id), sample, weight });
    }

    for (const id of presentIds(loadout.directives)) {
      addPick({ picks: directives, key: String(id), sample, weight });
    }

    for (const tag of unique(loadout.fieldModifications)) {
      addPick({ picks: fieldModifications, key: tag, sample, weight });
    }

    const loaded = uniqueBy(
      loadout.shells.filter((shell) => shell.count > 0),
      (shell) => shell.shellId
    );

    const ammo = sumBy(loaded, (shell) => shell.count);

    if (ammo > 0) {
      shellWeight += weight;
    }

    for (const shell of loaded) {
      const entry = shells.get(shell.shellId) ?? { weight: 0, battles: 0, count: 0, ammo: 0 };

      entry.weight += weight;
      entry.battles += 1;
      entry.count += shell.count;
      entry.ammo += (weight * shell.count) / ammo;
      shells.set(shell.shellId, entry);
    }

    for (const member of loadout.crew) {
      const role = crew.get(member.role) ?? { weight: 0, members: 0, skills: new Map() };

      role.weight += weight;
      role.members += 1;

      unique(member.skills).forEach((skill, position) => {
        const entry = role.skills.get(skill) ?? { weight: 0, count: 0, positions: 0 };

        entry.weight += weight;
        entry.count += 1;
        entry.positions += position;
        role.skills.set(skill, entry);
      });

      crew.set(member.role, role);
    }
  }

  const decided = samples.filter((sample) => sample.won !== null);

  const usage: StoredBuildUsage = {
    equipment: sortBy([...slots.entries()], ([slot]) => slot).map(([slot, picks]) => ({ slot, picks: idPicks({ picks, players }) })),
    consumables: idPicks({ picks: consumables, players }),
    directives: idPicks({ picks: directives, players }),
    fieldModifications: toPicks({ picks: fieldModifications, players }).map(({ key, ...pick }) => ({ tag: key, ...pick })),
    shells: sortBy(
      [...shells.entries()].map(([shellId, entry]) => ({
        shellId,
        share: shellWeight > 0 ? share(entry.weight / shellWeight) : 0,
        ammoShare: shellWeight > 0 ? share(entry.ammo / shellWeight) : 0,
        avgCount: entry.count / entry.battles
      })),
      [(shell) => shell.ammoShare, 'desc']
    ),
    crew: [...crew.entries()].map(([role, entry]) => ({
      role,
      members: entry.members,
      skills: sortBy(
        [...entry.skills.entries()].map(([skill, stat]) => ({
          skill,
          share: share(stat.weight / entry.weight),
          avgPosition: stat.positions / stat.count
        })),
        [(skill) => skill.share, 'desc'],
        [(skill) => skill.avgPosition, 'asc']
      ).slice(0, BUILD_USAGE_AGGREGATE.maxPicks)
    }))
  };

  return {
    battles: samples.length,
    players,
    winRate: percentOf({ value: decided.filter((sample) => sample.won).length, by: decided.length }),
    avgDamage: ratio({ value: sumBy(samples, (sample) => sample.damage), by: samples.length }),
    usage
  };
};

const inCohort = ({ cohort, rank }: InCohortInput): boolean =>
  cohort === 'all' || (rank !== undefined && rank <= BUILD_USAGE_AGGREGATE.cohortShares[cohort]);

export const groupUsage = ({ samples, ranks }: GroupUsageInput): UsageGroup[] => {
  const rankOf = new Map(ranks.map((entry) => [entry.accountId, entry.rank]));

  return entries(groupBy(samples, (sample) => sample.mode)).flatMap(([mode, list]) =>
    BUILD_USAGE.cohorts.flatMap((cohort): UsageGroup[] => {
      const members = list.filter((sample) => inCohort({ cohort, rank: rankOf.get(sample.accountId) }));

      return members.length > 0 ? [{ mode, cohort, ...summarizeUsage(members) }] : [];
    })
  );
};
