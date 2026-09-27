import { InstallWizardProvider } from '@/features/setup/install-modpack';

import type { InstallWizardProps } from './InstallWizard.types';

import { WizardBody } from './components';

export const InstallWizard = ({ initialPreset }: InstallWizardProps) => (
  <InstallWizardProvider initialPreset={initialPreset}>
    <WizardBody />
  </InstallWizardProvider>
);
