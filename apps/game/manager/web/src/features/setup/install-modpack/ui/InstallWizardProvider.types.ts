import type { ReactNode } from 'react';

export type InstallWizardProviderProps = {
  initialPreset: string | null;
  initialComponents: string[] | null;
  startAtReview: boolean;
  children: ReactNode;
};
