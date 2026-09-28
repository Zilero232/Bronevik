'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { QUERY_KEYS } from '@/shared/constants';

import type { CreateKeyFormValues } from '../../../lib/key-form';
import type { UseCreateKeyFormInput } from './use-create-key-form.types';

import { createApiKey } from '../../../api';
import { CREATE_KEY_FORM_DEFAULT_VALUES } from '../../../config';
import { createKeyFormSchema, toCreateApiKeyInput } from '../../../lib/key-form';

export const useCreateKeyForm = ({ onCreated }: UseCreateKeyFormInput) => {
  const create = useMutation({
    mutationFn: createApiKey,
    meta: { successKey: 'developer.toast.keyCreated', invalidates: [QUERY_KEYS.me.developer.overview, QUERY_KEYS.me.developer.keys] }
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError
  } = useForm<CreateKeyFormValues>({ resolver: zodResolver(createKeyFormSchema), defaultValues: CREATE_KEY_FORM_DEFAULT_VALUES });

  const onSubmit = handleSubmit(async (values) => {
    try {
      onCreated(await create.mutateAsync(toCreateApiKeyInput({ ...values, now: new Date() })));
    } catch {
      setError('root.server', { message: 'server' });
    }
  });

  return { control, errors, isSubmitting, register, onSubmit };
};
