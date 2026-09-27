import type { INSTALL_WIZARD } from '../../../config';

export type WizardStep = (typeof INSTALL_WIZARD.steps)[number];

export type UseInstallWizardStateInput = {
  initialPreset: string | null;
};

export type ToggleInput = {
  id: string;
  checked: boolean;
};
