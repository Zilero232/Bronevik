import type { SettingsField } from '@/entities/streamer/settings';

export type SettingsNumberFieldProps = {
  field: Extract<SettingsField, { kind: 'number' }>;
};
