import type { ReactNode } from 'react';

export type ConfirmDialogProps = {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  confirmLabel: ReactNode;
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};
