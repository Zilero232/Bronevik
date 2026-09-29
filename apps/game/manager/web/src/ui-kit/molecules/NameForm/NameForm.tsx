import { Save } from 'lucide-react';

import type { NameFormProps } from './NameForm.types';

import { Button, TextInput } from '../../atoms';
import { FormField } from '../FormField';

export const NameForm = ({ className, label, hint, placeholder, submitLabel, field, error, disabled, isPending, onSubmit }: NameFormProps) => (
  <form className={className} onSubmit={onSubmit}>
    <FormField error={error} hint={hint} label={label}>
      {(control) => <TextInput {...control} {...field} autoComplete='off' disabled={disabled} placeholder={placeholder} />}
    </FormField>
    <Button disabled={disabled} isPending={isPending} type='submit'>
      <Save aria-hidden />
      {submitLabel}
    </Button>
  </form>
);
