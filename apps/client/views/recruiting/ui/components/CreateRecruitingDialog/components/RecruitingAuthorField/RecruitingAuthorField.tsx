'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { AccountSelect } from '@/features/community/viewer';
import { Select } from '@/ui-kit';

import type { RecruitingFormOutput, RecruitingFormValues } from '../../../../../lib/recruiting-form';
import type { RecruitingAuthorFieldProps } from './RecruitingAuthorField.types';

import s from './RecruitingAuthorField.module.scss';

export const RecruitingAuthorField = ({ isClan, isClansPending, officers }: RecruitingAuthorFieldProps) => {
  const t = useTranslations('recruiting.create');
  const { control } = useFormContext<RecruitingFormValues, unknown, RecruitingFormOutput>();

  if (!isClan) {
    return <Controller control={control} name='accountId' render={({ field }) => <AccountSelect value={field.value} onChange={field.onChange} />} />;
  }

  if (officers.length === 0) {
    return <p className={s.warning}>{isClansPending ? t('checkingClan') : t('notOfficer')}</p>;
  }

  return (
    <Controller
      render={({ field }) => (
        <Select
          items={officers.map((officer) => ({ value: String(officer.accountId), label: `[${officer.clanTag}] ${officer.nickname}` }))}
          label={t('clan')}
          value={field.value}
          onValueChange={field.onChange}
        />
      )}
      control={control}
      name='accountId'
    />
  );
};
