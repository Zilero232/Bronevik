import type { SettingsValues } from '@otmetki/schemas';
import type { FieldValues } from 'react-hook-form';

import type { SettingsField } from '@/entities/streamer/settings';

export type SettingsFormValues = FieldValues;

export type SettingsFormLeaf = number | string | string[] | null;

export type LeafInput = {
  field: SettingsField;
  value: unknown;
};

export type AssignPathInput = {
  target: Record<string, unknown>;
  path: string;
  value: unknown;
};

export type CompactInput = {
  value: unknown;
  prefix: string;
  drop: ReadonlySet<string>;
};

export type MergeSettingsInput = {
  base: SettingsValues;
  edited: SettingsValues;
};

type Underscored<S extends string> = S extends `${infer Head}.${infer Tail}` ? `${Head}_${Underscored<Tail>}` : S;

export type SettingsFieldLabelKey = `fields.${Underscored<SettingsField['path']>}`;
