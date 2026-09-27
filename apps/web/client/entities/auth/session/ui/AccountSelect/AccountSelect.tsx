'use client';

import { useTranslations } from 'next-intl';

import { Select } from '@/ui-kit';

import type { AccountSelectProps } from './AccountSelect.types';

import { COMMUNITY_ACCOUNT } from '../../config';
import { useCommunityViewer } from '../../model/hooks';

export const AccountSelect = ({ value, className, onChange }: AccountSelectProps) => {
  const t = useTranslations('community.accounts');
  const { accounts } = useCommunityViewer();

  if (accounts.length < 2) {
    return null;
  }

  return (
    <Select
      items={[
        { value: COMMUNITY_ACCOUNT.primary, label: t('primary') },
        ...accounts.map(({ accountId, nickname }) => ({ value: String(accountId), label: nickname }))
      ]}
      className={className}
      label={t('label')}
      value={value}
      onValueChange={onChange}
    />
  );
};
