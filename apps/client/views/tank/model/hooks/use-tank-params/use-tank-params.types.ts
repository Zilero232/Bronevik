import type { TankSpecKey } from '@/entities/tank/tank';

export type ParamRow = {
  key: TankSpecKey;
  label: string;
  value: string;
  unit: string;
  share: number | null;
};

export type ParamTab = {
  value: string;
  label: string;
  rows: ParamRow[];
};

export type ParamRowInput = {
  key: TankSpecKey;
  value: number | null | undefined;
  share: number | null;
};
