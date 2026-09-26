import type { PreferencesImport } from '@/entities/streamer/preferences';

export type SettingsImportStatus = 'empty' | 'idle' | 'invalid' | 'ready';

export type UseSettingsImportXmlInput = {
  onImport: (result: PreferencesImport) => void;
};
