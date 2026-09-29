import type { FormEventHandler } from 'react';

import type { TextInputProps } from '../../atoms';

export type NameDialogProps = {
  open: boolean;
  title: string;
  label: string;
  submitLabel: string;
  field: TextInputProps;
  error?: string;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};
