'use client';

import type { FieldValues } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useRouter } from '@/shared/i18n/navigation';

import type { UseFormDialogInput } from './use-form-dialog.types';

export const useFormDialog = <TValues extends FieldValues, TOutput extends FieldValues, TData>({
  schema,
  defaults,
  mutationFn,
  onSuccess,
  successMessage,
  errorMessage,
  invalidate,
  redirect
}: UseFormDialogInput<TValues, TOutput, TData>) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useBoolean(false);
  const form = useForm<TValues, unknown, TOutput>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: 'onTouched'
  });

  const mutation = useMutation({
    mutationFn,
    onSuccess: async (...args) => {
      toast.success(successMessage);
      await onSuccess?.(...args);

      if (invalidate) {
        await queryClient.invalidateQueries({ queryKey: invalidate });
      }

      if (redirect) {
        router.push(redirect(args[0]));
      }
    },
    onError: (error) => toast.error(errorMessage(error))
  });

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    form.reset(defaults);
  };

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values, { onSuccess: () => onOpenChange(false) }));

  return { form, isOpen, isPending: mutation.isPending, onOpenChange, onSubmit };
};
