'use client';

import { AtSign } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { STREAMER_PROFILE } from '@/shared/api/streamers';
import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Input } from '@/ui-kit';

import type { ProfileFormOutput, ProfileFormValues } from '../../../lib/profile-form';

import { FormField } from '../FormField';

import s from './ProfileIdentityFields.module.scss';

export const ProfileIdentityFields = () => {
  const t = useTranslations('streamer.profile');
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<ProfileFormValues, unknown, ProfileFormOutput>();

  const [slug, bio] = useWatch({ control, name: ['slug', 'bio'] });
  const id = useId();

  const slugError = errors.slug?.message === 'slugTaken' ? t('errors.slugTaken') : errors.slug && t('errors.slug');

  return (
    <div className={s.root}>
      <FormField error={slugError} hint={t('slugHint')} htmlFor={`${id}-slug`} label={t('slug')}>
        <Input icon={<AtSign size={15} />} id={`${id}-slug`} isInvalid={Boolean(errors.slug)} spellCheck={false} {...register('slug')} />
        <p className={s.preview}>
          <span className={s.origin}>{SITE.url}</span>
          <span className={s.path}>{ROUTES.streamer(slug.trim().toLowerCase() || t('slugPlaceholder'))}</span>
        </p>
      </FormField>
      <FormField error={errors.displayName && t('errors.displayName')} htmlFor={`${id}-name`} label={t('displayName')}>
        <Input id={`${id}-name`} isInvalid={Boolean(errors.displayName)} {...register('displayName')} />
      </FormField>
      <FormField
        error={errors.bio && t('errors.bio', { max: STREAMER_PROFILE.bioMaxLength })}
        hint={t('bioCount', { count: bio.length, max: STREAMER_PROFILE.bioMaxLength })}
        htmlFor={`${id}-bio`}
        label={t('bio')}
      >
        <textarea className={s.textarea} id={`${id}-bio`} placeholder={t('bioPlaceholder')} rows={5} {...register('bio')} />
      </FormField>
    </div>
  );
};
