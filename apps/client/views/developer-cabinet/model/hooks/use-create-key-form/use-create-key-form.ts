'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createApiKey } from '../../../api';
import { QUERY_KEYS } from '@/shared/constants';

import type { CreateKeyFormValues } from '../../../lib/key-form';
import type { UseCreateKeyFormInput } from './use-create-key-form.types';

import { CREATE_KEY_FORM_DEFAULT_VALUES } from '../../../config';
import { createKeyFormSchema, toCreateApiKeyInput } from '../../../lib/key-form';
import { useDeveloperMutation } from '../use-developer-mutation';

export const useCreateKeyForm = ({ onCreated }: UseCreateKeyFormInput) => {
  const create = useDeveloperMutation({
    mutationFn: createApiKey,
    invalidates: [QUERY_KEYS.me.developer.keys],
    successKey: 'keyCreated',
    isErrorToasted: false
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
