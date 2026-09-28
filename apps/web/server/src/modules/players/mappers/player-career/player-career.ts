import type { PlayerAssist } from '@otmetki/schemas';

import type { BattleStatsBlock } from '../../../../lib/lesta';
import type { CareerRecordRef, CareerSource } from './player-career.types';

export const careerSourceFromBlock = (block: BattleStatsBlock): CareerSource => ({
  avgDamageAssisted: block.avg_damage_assisted ?? null,
  avgDamageAssistedRadio: block.avg_damage_assisted_radio ?? null,
  avgDamageAssistedTrack: block.avg_damage_assisted_track ?? null,
  avgDamageAssistedStun: block.avg_damage_assisted_stun ?? null,
  maxDamage: block.max_damage ?? null,
  maxDamageTankId: block.max_damage_tank_id ?? null,
  maxXp: block.max_xp ?? null,
  maxXpTankId: block.max_xp_tank_id ?? null,
  maxFrags: block.max_frags ?? null,
  maxFragsTankId: block.max_frags_tank_id ?? null
});

export const toPlayerAssist = (source: CareerSource): PlayerAssist | null => {
  const assist = {
    avgAssisted: source.avgDamageAssisted,
    avgRadio: source.avgDamageAssistedRadio,
    avgTrack: source.avgDamageAssistedTrack,
    avgStun: source.avgDamageAssistedStun
  };

  return Object.values(assist).every((value) => value === null) ? null : assist;
};

export const careerRecordRefs = (source: CareerSource): CareerRecordRef[] =>
  [
    { key: 'maxDamage' as const, value: source.maxDamage, tankId: source.maxDamageTankId },
    { key: 'maxXp' as const, value: source.maxXp, tankId: source.maxXpTankId },
    { key: 'maxFrags' as const, value: source.maxFrags, tankId: source.maxFragsTankId }
  ].flatMap(({ key, value, tankId }) => (value !== null && value > 0 ? [{ key, value, tankId }] : []));
