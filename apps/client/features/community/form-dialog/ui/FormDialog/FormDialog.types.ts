import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { Messages } from '@/shared/i18n';

import type { FormDialogModel } from '../../model/hooks';

type FormDialogLabel = 'cancel' | 'description' | 'open' | 'submit' | 'title';

type LabelNamespaces<TMessages, TPrefix extends string = ''> = {
  [TKey in keyof TMessages & string]: TMessages[TKey] extends Record<FormDialogLabel, string>
    ? `${TPrefix}${TKey}`
    : TMessages[TKey] extends Record<string, unknown>
      ? LabelNamespaces<TMessages[TKey], `${TPrefix}${TKey}.`>
      : never;
}[keyof TMessages & string];

export type FormDialogNamespace = LabelNamespaces<Messages>;

export type FormDialogProps<TValues extends FieldValues, TOutput extends FieldValues> = {
  dialog: FormDialogModel<TValues, TOutput>;
  namespace: FormDialogNamespace;
  triggerIcon?: LucideIcon;
  canSubmit?: boolean;
  requiresLesta?: boolean;
  triggerClassName?: string;
  isTriggerDisabled?: boolean;
  children: ReactNode;
};
