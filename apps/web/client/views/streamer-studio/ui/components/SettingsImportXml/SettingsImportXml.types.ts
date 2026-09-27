import type { PreferencesImport } from '@/entities/streamer/preferences';

export type SettingsImportXmlProps = {
  onImport: (result: PreferencesImport) => void;
};
