import type { SettingsField } from '@/entities/streamer/settings';

export type SettingsChoiceFieldInput = Extract<SettingsField, { kind: 'boolean' | 'enum' }>;
