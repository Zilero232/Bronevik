import type { InstallWizardProviderProps } from './InstallWizardProvider.types';

import { InstallWizardContext } from '../model/context';
import { useInstallWizardState } from '../model/hooks';

export const InstallWizardProvider = ({ initialPreset, initialComponents, children }: InstallWizardProviderProps) => {
  const value = useInstallWizardState({ initialPreset, initialComponents });

  return <InstallWizardContext value={value}>{children}</InstallWizardContext>;
};
