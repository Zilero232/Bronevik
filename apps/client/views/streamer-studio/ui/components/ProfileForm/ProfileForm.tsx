'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { ExternalLink, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, SectionHeader } from '@/ui-kit';

import type { ProfileFormOutput, ProfileFormValues } from '../../../lib/profile-form';
import type { ProfileFormProps } from './ProfileForm.types';

import { PROFILE_FORM } from '../../../config';
import { profileFormSchema, toProfileFormValues, toProfileInput } from '../../../lib/profile-form';
import { useSaveStreamerProfile } from '../../../model/hooks';
import { ProfileAccountField } from '../ProfileAccountField';
import { ProfileIdentityFields } from '../ProfileIdentityFields';
import { ProfileLinksFields } from '../ProfileLinksFields';

import s from './ProfileForm.module.scss';

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const t = useTranslations('streamer.profile');
  const tToast = useTranslations('streamer.studio.toast');
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

    toast.error(tToast('failed'));
  };

  const onSubmit = form.handleSubmit((values) => save.mutate(toProfileInput(values), { onError }));

  return (
    <FormProvider {...form}>
      <form noValidate className={s.root} onSubmit={onSubmit}>
        <SectionHeader description={t('description')} eyebrow={t('eyebrow')} title={t('title')} />
        <div className={s.grid}>
          <ProfileIdentityFields />
          <div className={s.side}>
            <ProfileAccountField />
            <ProfileLinksFields />
          </div>
        </div>
        <footer className={s.footer}>
          <Button disabled={save.isPending} type='submit'>
            <Save size={16} />
            {t('save')}
          </Button>
          {profile && (
            <Link className={buttonVariants({ variant: 'ghost' })} href={ROUTES.streamer(profile.slug)}>
              <ExternalLink size={15} />
              {t('publicLink')}
            </Link>
          )}
        </footer>
      </form>
    </FormProvider>
  );
};
