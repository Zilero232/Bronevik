import type { SettingsField } from '@/entities/streamer/settings';

export type SettingsMultiFieldInput = Extract<SettingsField, { kind: 'multi' }>;
