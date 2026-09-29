import type { INSTALL_WIZARD } from '../../../config';
import type { Selection } from '../../../lib';

export type WizardStep = (typeof INSTALL_WIZARD.steps)[number];

export type UseInstallWizardStateInput = {
  initialPreset: string | null;
  initialComponents: string[] | null;
};

export type ToggleInput = {
  id: string;
  checked: boolean;
};

export type ClientScoped = {
  clientPath: string | null;
  selection: Selection;
};
