'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { apiErrorSchema } from '@otmetki/schemas';
import { isAxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { StreamerProfile } from '@/entities/streamer/streamer';

import type { ProfileFormOutput, ProfileFormValues } from '../../../lib/profile-form';

import { PROFILE_FORM } from '../../../config';
import { profileFormSchema, rejectedPlatform, toProfileFormValues, toProfileInput } from '../../../lib/profile-form';
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
    const code = isAxiosError(error) ? apiErrorSchema.safeParse(error.response?.data).data?.code : undefined;

    if (code === PROFILE_FORM.slugTakenCode) {
      form.setError('slug', { type: 'server', message: 'slugTaken' });

      return;
    }

    if (code === PROFILE_FORM.channelTakenCode) {
      toast.error(t('channelTaken'));

      return;
    }

    const platform = isAxiosError(error) ? rejectedPlatform(error.response?.data) : null;

    if (platform) {
      form.setError(`channels.${platform}`, { type: 'server', message: 'link' }, { shouldFocus: true });
      toast.error(t('channelInvalid'));

      return;
    }

    toast.error(t('failed'));
  };

  const onSubmit = form.handleSubmit((values) => save.mutate(toProfileInput(values), { onError }));

  return { form, isPending: save.isPending, onSubmit };
};
