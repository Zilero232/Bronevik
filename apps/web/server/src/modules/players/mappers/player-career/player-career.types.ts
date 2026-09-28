import type { AccountSnapshot } from '../../../../../generated';

export type CareerSource = Pick<
  AccountSnapshot,
  | 'avgDamageAssisted'
  | 'avgDamageAssistedRadio'
  | 'avgDamageAssistedStun'
  | 'avgDamageAssistedTrack'
  | 'maxDamage'
  | 'maxDamageTankId'
  | 'maxFrags'
  | 'maxFragsTankId'
  | 'maxXp'
  | 'maxXpTankId'
>;

export type CareerRecordKey = 'maxDamage' | 'maxFrags' | 'maxXp';

export type CareerRecordRef = {
  key: CareerRecordKey;
  value: number;
  tankId: number | null;
};
