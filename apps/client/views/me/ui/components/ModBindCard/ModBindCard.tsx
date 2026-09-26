'use client';

import { Cpu, KeySquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getModDevices, issueBindCode, revokeModDevice } from '@/shared/api/me';
import { Button } from '@/ui-kit';

import { useMeMutation, useMeSection } from '../../../model/hooks';
import { BindCodeDisplay } from '../BindCodeDisplay';
import { DeviceList } from '../DeviceList';
import { MeCard } from '../MeCard';
import { SectionError } from '../SectionError';

import s from './ModBindCard.module.scss';

const STEPS = ['install', 'open', 'enter'] as const;

export const ModBindCard = () => {
  const t = useTranslations('me.mod');
  const { data: devices, isError, isFetching, refetch } = useMeSection({ section: 'devices', fetcher: getModDevices });
  const issue = useMeMutation({ section: 'devices', mutationFn: () => issueBindCode() });
  const revoke = useMeMutation({ section: 'devices', mutationFn: revokeModDevice, successKey: 'deviceRevoked' });

  return (
    <MeCard description={t('description')} icon={<Cpu size={18} />} title={t('title')}>
      {issue.data ? (
        <BindCodeDisplay code={issue.data} onRenew={() => issue.mutate(undefined)} />
      ) : (
        <Button block disabled={issue.isPending} onClick={() => issue.mutate(undefined)}>
          <KeySquare size={16} />
          {t('issue')}
        </Button>
      )}
      <ol className={s.steps}>
        {STEPS.map((step, index) => (
          <li key={step} className={s.step}>
            <span className={s.number}>{index + 1}</span>
            {t(`steps.${step}`)}
          </li>
        ))}
      </ol>
      {isError ? (
        <SectionError isRetrying={isFetching} onRetry={() => void refetch()} />
      ) : (
        <DeviceList devices={devices ?? []} isRevoking={revoke.isPending} onRevoke={(id) => revoke.mutate(id)} />
      )}
    </MeCard>
  );
};
