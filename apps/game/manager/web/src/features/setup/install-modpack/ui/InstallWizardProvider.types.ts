import type { ReactNode } from 'react';

export type InstallWizardProviderProps = {
  initialPreset: string | null;
  initialComponents: string[] | null;
  children: ReactNode;
};
