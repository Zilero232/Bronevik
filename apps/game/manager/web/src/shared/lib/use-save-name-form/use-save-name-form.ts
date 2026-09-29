import { useMutation } from '@tanstack/react-query';

import type { UseSaveNameFormInput } from './use-save-name-form.types';

import { useErrorToast } from '../use-error-toast';
import { useNameForm } from '../use-name-form';

export const useSaveNameForm = <View>({ maxLength, message, save, onSaved }: UseSaveNameFormInput<View>) => {
  const showError = useErrorToast();
  const form = useNameForm({ name: '', maxLength, message });

  const mutation = useMutation({
    mutationFn: save,
    onSuccess: (view) => {
      onSaved(view);
      form.reset();
    },
    onError: showError
  });

  return {
    field: form.field,
    error: form.error,
    isPending: mutation.isPending,
    onSubmit: form.submitWith((name) => mutation.mutate(name))
  };
};
