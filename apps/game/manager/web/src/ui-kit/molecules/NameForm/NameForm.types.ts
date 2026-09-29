import type { FormEventHandler } from 'react';

import type { TextInputProps } from '../../atoms';

export type NameFormProps = {
  className?: string;
  label: string;
  hint?: string;
  placeholder: string;
  submitLabel: string;
  field: TextInputProps;
  error?: string;
  disabled: boolean;
  isPending: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
};
