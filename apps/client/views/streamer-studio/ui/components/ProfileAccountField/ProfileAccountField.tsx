'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { Select } from '@/ui-kit';

import type { ProfileFormOutput, ProfileFormValues } from '../../../lib/profile-form';

import { PROFILE_FORM } from '../../../config';
import { useLinkedAccounts } from '../../../model/hooks';

import s from './ProfileAccountField.module.scss';

export const ProfileAccountField = () => {
  const t = useTranslations('streamer.profile');
  const { control } = useFormContext<ProfileFormValues, unknown, ProfileFormOutput>();
  const { data: accounts } = useLinkedAccounts();

  const items = [
    { value: PROFILE_FORM.noAccount, label: t('accountNone') },
    ...(accounts?.lesta ?? []).map(({ accountId, nickname }) => ({ value: String(accountId), label: nickname }))
  ];

  return (
    <div className={s.root}>
      <Controller
        control={control}
        name='accountId'
        render={({ field }) => <Select items={items} label={t('account')} value={field.value} onValueChange={field.onChange} />}
      />
      <p className={s.hint}>{t('accountHint')}</p>
    </div>
  );
};
