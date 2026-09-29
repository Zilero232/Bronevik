import { InstallWizardProvider } from '@/features/setup/install-modpack';

import type { InstallWizardProps } from './InstallWizard.types';

import { WizardBody } from './components';

export const InstallWizard = ({ initialPreset, initialComponents }: InstallWizardProps) => (
  <InstallWizardProvider initialComponents={initialComponents} initialPreset={initialPreset}>
    <WizardBody />
  </InstallWizardProvider>
);
