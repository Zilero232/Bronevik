import type { SettingsField } from '@/entities/streamer/settings';

export type SettingsChoiceFieldProps = {
  field: Extract<SettingsField, { kind: 'boolean' | 'enum' }>;
};
