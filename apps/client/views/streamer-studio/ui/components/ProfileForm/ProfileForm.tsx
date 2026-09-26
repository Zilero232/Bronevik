'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FormProvider } from 'react-hook-form';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { ProfileFormProps } from './ProfileForm.types';

import { useProfileForm } from '../../../model/hooks';
import { ProfileAccountField } from '../ProfileAccountField';
import { ProfileIdentityFields } from '../ProfileIdentityFields';
import { ProfileLinksFields } from '../ProfileLinksFields';

import s from './ProfileForm.module.scss';

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const t = useTranslations('streamer.profile');
  const { form, isPending, onSubmit } = useProfileForm(profile);

  return (
    <FormProvider {...form}>
      <form noValidate className={s.root} onSubmit={onSubmit}>
        <p className={s.note}>{t('description')}</p>
        <div className={s.grid}>
          <ProfileIdentityFields />
          <div className={s.side}>
            <ProfileAccountField />
            <ProfileLinksFields />
          </div>
        </div>
        <footer className={s.footer}>
          <Button disabled={isPending} type='submit'>
            {t('save')}
          </Button>
          {profile && (
            <Link className={buttonVariants({ variant: 'ghost' })} href={ROUTES.streamer(profile.slug)}>
              <ExternalLink size={14} />
              {t('publicLink')}
            </Link>
          )}
        </footer>
      </form>
    </FormProvider>
  );
};
