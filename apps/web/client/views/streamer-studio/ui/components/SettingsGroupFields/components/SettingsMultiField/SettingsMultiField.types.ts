import type { SettingsField } from '@/entities/streamer/settings';

export type SettingsMultiFieldProps = {
  field: Extract<SettingsField, { kind: 'multi' }>;
};
