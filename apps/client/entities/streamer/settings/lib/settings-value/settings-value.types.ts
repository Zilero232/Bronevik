import type { Messages } from '@/shared/i18n';

export type SettingsFieldMessage = keyof Messages['streamerSettings']['fields'];

export type SettingsOption = keyof Messages['streamerSettings']['options'];

export type SettingsUnit = keyof Messages['streamerSettings']['units'];

export type SettingsValueView =
  | { kind: 'list'; items: string[] }
  | { kind: 'number'; value: number; unit: SettingsUnit | null; digits: number | null }
  | { kind: 'options'; options: SettingsOption[]; isList: boolean }
  | { kind: 'text'; text: string };
