import type { FrontlinePlanInput } from '../../../lib/frontline';

type NullableFields = Omit<FrontlinePlanInput, 'battlesPerDay'>;

export type FrontlineValues = { [K in keyof NullableFields]: NullableFields[K] | null } & Pick<FrontlinePlanInput, 'battlesPerDay'>;

export type FrontlineResultItem = {
  key: string;
  label: string;
  value: string;
  tone?: 'bad' | 'good' | 'neutral';
};
