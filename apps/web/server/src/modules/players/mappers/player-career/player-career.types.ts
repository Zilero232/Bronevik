export type CareerRecordKey = 'maxDamage' | 'maxFrags' | 'maxXp';

export type CareerRecordRef = {
  key: CareerRecordKey;
  value: number;
  tankId: number | null;
};
