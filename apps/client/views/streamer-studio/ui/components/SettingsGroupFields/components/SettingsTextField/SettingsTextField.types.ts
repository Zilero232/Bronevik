import type { SettingsField } from '@/entities/streamer/settings';

export type SettingsTextFieldProps = {
  field: Extract<SettingsField, { kind: 'text' }>;
};
