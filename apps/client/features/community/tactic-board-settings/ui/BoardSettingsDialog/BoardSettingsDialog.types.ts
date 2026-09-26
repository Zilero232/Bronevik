import type { ReactNode } from 'react';

import type { ButtonVariantProps } from '@/ui-kit';

import type { BoardSettingsFormProps } from '../BoardSettingsForm.types';

export type BoardSettingsDialogProps = BoardSettingsFormProps & {
  trigger: ReactNode;
  triggerVariant?: ButtonVariantProps['variant'];
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};
