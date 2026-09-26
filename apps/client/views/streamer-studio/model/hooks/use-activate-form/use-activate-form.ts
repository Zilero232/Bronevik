'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { useForm } from 'react-hook-form';

import type { ActivateFormOutput, ActivateFormValues } from '../../../lib/activate-form';

import { ACTIVATE_FORM_DEFAULT_VALUES } from '../../../config';
import { activateFormSchema } from '../../../lib/activate-form';
import { useActivateChallenge } from '../use-challenges';

export const useActivateForm = (id: string) => {
  const activate = useActivateChallenge();
  const [isOpen, setOpen] = useBoolean(false);
  const form = useForm<ActivateFormValues, unknown, ActivateFormOutput>({
    resolver: zodResolver(activateFormSchema),
    defaultValues: ACTIVATE_FORM_DEFAULT_VALUES
  });

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) {
      form.reset(ACTIVATE_FORM_DEFAULT_VALUES);
    }
  };

  const onSubmit = form.handleSubmit(({ donorName }) => activate.mutate({ id, donorName }, { onSuccess: () => onOpenChange(false) }));

  return { form, isOpen, isPending: activate.isPending, onOpenChange, onSubmit };
};
