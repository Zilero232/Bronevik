import { groupBy, sumBy, unique } from 'remeda';

import type { BattleSample, DeltaRow, ModBattleRow, PickSamplesInput } from './battle-samples.types';

export const battlesOf = (samples: readonly BattleSample[]): number => sumBy(samples, (sample) => sample.battles);

export const sampleFromDelta = (row: DeltaRow): BattleSample => ({
  tankId: row.tankId,
  battles: row.battles,
  wins: row.wins,
  damage: row.damageDealt,
  spotted: row.spotted,
  frags: row.frags,
  blocked: row.damageBlocked,
  survived: row.survived,
  isSingle: row.battles === 1,
  moeRaised: null
});

export const sampleFromBattle = (row: ModBattleRow): BattleSample => ({
  tankId: row.tankId,
  battles: 1,
  wins: row.result === 'win' ? 1 : 0,
  damage: row.damageDealt,
  spotted: row.spotted,
  frags: row.frags,
  blocked: row.damageBlocked,
  survived: row.survived ? 1 : 0,
  isSingle: true,
  moeRaised: row.moePercentDelta === null ? null : row.moePercentDelta > 0
});

export const pickSamplesByTank = ({ api, mod }: PickSamplesInput): Map<number, BattleSample[]> => {
  const apiByTank = groupBy(api, (sample) => sample.tankId);
  const modByTank = groupBy(mod, (sample) => sample.tankId);
  const result = new Map<number, BattleSample[]>();

  for (const tankId of unique([...api, ...mod].map((sample) => sample.tankId))) {
    const fromApi = apiByTank[tankId] ?? [];
    const fromMod = modByTank[tankId] ?? [];

    result.set(tankId, battlesOf(fromMod) >= battlesOf(fromApi) ? [...fromMod] : [...fromApi]);
  }

  return result;
};
