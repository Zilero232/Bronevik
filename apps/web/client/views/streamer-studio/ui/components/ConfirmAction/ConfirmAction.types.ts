import type { ReactNode } from 'react';

export type ConfirmActionProps = {
  triggerLabel: ReactNode;
  title: ReactNode;
  description: ReactNode;
  confirmLabel: ReactNode;
  isPending?: boolean;
  onConfirm: () => void;
};
