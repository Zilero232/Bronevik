'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { StreamerProfile } from '@/shared/api/streamers';

import type { ProfileFormOutput, ProfileFormValues } from '../../../lib/profile-form';

import { PROFILE_FORM } from '../../../config';
import { profileFormSchema, toProfileFormValues, toProfileInput } from '../../../lib/profile-form';
import { useSaveStreamerProfile } from '../use-streamer-profile';

export const useProfileForm = (profile: StreamerProfile | null) => {
  const t = useTranslations('streamer.studio.toast');
  const save = useSaveStreamerProfile();
  const form = useForm<ProfileFormValues, unknown, ProfileFormOutput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: toProfileFormValues(profile),
    mode: 'onTouched'
  });

  const onError = (error: Error) => {
    if (isAxiosError(error) && error.response?.status === PROFILE_FORM.slugTakenStatus) {
      form.setError('slug', { type: 'server', message: 'slugTaken' });

      return;
    }

    toast.error(t('failed'));
  };

  const onSubmit = form.handleSubmit((values) => save.mutate(toProfileInput(values), { onError }));

  return { form, isPending: save.isPending, onSubmit };
};
