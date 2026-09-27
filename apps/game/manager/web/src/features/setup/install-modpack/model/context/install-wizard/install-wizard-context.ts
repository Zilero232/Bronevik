import { createContext, use } from 'react';

import type { InstallWizardValue } from './install-wizard-context.types';

export const InstallWizardContext = createContext<InstallWizardValue | null>(null);

export const useInstallWizard = (): InstallWizardValue => {
  const value = use(InstallWizardContext);

  if (!value) {
    throw new Error('useInstallWizard must be used inside InstallWizardProvider');
  }

  return value;
};
