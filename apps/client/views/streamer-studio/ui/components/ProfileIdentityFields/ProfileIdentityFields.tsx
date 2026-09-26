'use client';

import { STREAMER_PROFILE } from '@bronevik/schemas';
import { AtSign } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Input } from '@/ui-kit';

import { useProfileIdentityFields } from '../../../model/hooks';
import { FormField } from '../FormField';

import s from './ProfileIdentityFields.module.scss';

export const ProfileIdentityFields = () => {
  const t = useTranslations('streamer.profile');
  const id = useId();
  const { register, slug, bioLength, slugError, hasDisplayNameError, hasBioError } = useProfileIdentityFields();

  return (
    <div className={s.root}>
      <FormField error={slugError && t(`errors.${slugError}`)} hint={t('slugHint')} htmlFor={`${id}-slug`} label={t('slug')}>
        <Input icon={<AtSign size={14} />} id={`${id}-slug`} isInvalid={Boolean(slugError)} spellCheck={false} {...register('slug')} />
        <p className={s.preview}>
          <span className={s.origin}>{SITE.url}</span>
          <span className={s.path}>{ROUTES.streamer(slug || t('slugPlaceholder'))}</span>
        </p>
      </FormField>
      <FormField error={hasDisplayNameError && t('errors.displayName')} htmlFor={`${id}-name`} label={t('displayName')}>
        <Input id={`${id}-name`} isInvalid={hasDisplayNameError} {...register('displayName')} />
      </FormField>
      <FormField
        error={hasBioError && t('errors.bio', { max: STREAMER_PROFILE.bioMaxLength })}
        hint={t('bioCount', { count: bioLength, max: STREAMER_PROFILE.bioMaxLength })}
        htmlFor={`${id}-bio`}
        label={t('bio')}
      >
        <textarea className={s.textarea} id={`${id}-bio`} placeholder={t('bioPlaceholder')} rows={5} {...register('bio')} />
      </FormField>
    </div>
  );
};
