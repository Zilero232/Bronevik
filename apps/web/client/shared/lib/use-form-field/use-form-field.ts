import { useId } from 'react';

import type { FormControlA11y, UseFormFieldInput } from './use-form-field.types';

export const useFormField = ({ htmlFor, hasHint, hasError }: UseFormFieldInput) => {
  const baseId = useId();

  const controlId = htmlFor ?? `${baseId}-control`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;
  const describedBy = hasError ? errorId : hasHint ? hintId : undefined;
  const control: FormControlA11y = {
    ...(htmlFor ? {} : { id: controlId }),
    ...(describedBy ? { 'aria-describedby': describedBy } : {}),
    ...(hasError ? { 'aria-invalid': true } : {})
  };

  return { controlId, hintId, errorId, control };
};
