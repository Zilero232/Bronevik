import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { UseNameFormInput } from './use-name-form.types';

export const useNameForm = ({ name, maxLength, message }: UseNameFormInput) => {
  const schema = z.object({ name: z.string().trim().min(1, message).max(maxLength, message) });
  const form = useForm({ resolver: zodResolver(schema), values: { name } });

  return {
    field: form.register('name'),
    error: form.formState.errors.name?.message,
    reset: () => form.reset(),
    submitWith: (onName: (value: string) => void) => form.handleSubmit((values) => onName(values.name))
  };
};
