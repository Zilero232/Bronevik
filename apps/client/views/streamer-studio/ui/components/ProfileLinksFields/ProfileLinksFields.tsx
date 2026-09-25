'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/ui-kit';

import type { ProfileFormOutput, ProfileFormValues } from '../../../lib/profile-form';

import { PROFILE_LINKS } from '../../../config';
import { FormField } from '../FormField';

import s from './ProfileLinksFields.module.scss';

export const ProfileLinksFields = () => {
  const t = useTranslations('streamer.profile');
  const {
    register,
    formState: { errors }
  } = useFormContext<ProfileFormValues, unknown, ProfileFormOutput>();

  const id = useId();

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t('links')}</legend>
      {PROFILE_LINKS.map((link) => (
        <FormField key={link} error={errors.links?.[link] && t('errors.link')} htmlFor={`${id}-${link}`} label={t(`link.${link}`)}>
          <Input
            id={`${id}-${link}`}
            inputMode='url'
            isInvalid={Boolean(errors.links?.[link])}
            placeholder={t(`linkPlaceholder.${link}`)}
            size='sm'
            spellCheck={false}
            type='url'
            {...register(`links.${link}`)}
          />
        </FormField>
      ))}
    </fieldset>
  );
};
