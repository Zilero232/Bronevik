import type { FormEventHandler, ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export type FormDialogProps<TValues extends FieldValues, TOutput> = {
  form: UseFormReturn<TValues, unknown, TOutput>;
  isOpen: boolean;
  isPending: boolean;
  canSubmit?: boolean;
  requiresLesta?: boolean;
  trigger: ReactNode;
  triggerClassName?: string;
  isTriggerDisabled?: boolean;
  title: ReactNode;
  description: ReactNode;
  cancelLabel: ReactNode;
  submitLabel: ReactNode;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};
