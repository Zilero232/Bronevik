'use client';

import { Link2, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { useLoginHref } from '@/entities/auth/session';
import { PlusGate } from '@/features/plus/plus-gate';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { MyModePanelProps } from './MyModePanel.types';

import { MY_MODE } from '../../../config';
import { useMyModeStats } from '../../../model/hooks';
import { MyModeLineView } from './components';

import s from './MyModePanel.module.scss';

export const MyModePanel = ({ mode }: MyModePanelProps) => {
  const loginHref = useLoginHref();
  const t = useTranslations('modes.mine');
  const { status, line, tanks, days, isRetrying, onRetry } = useMyModeStats(mode);

  return (
    <Card className={s.root} padding='none'>
      <CardHeader className={s.header} meta={t('period', { days })} title={t('title')} />
      <div className={s.body}>
        {status === 'signedOut' ? (
          <EmptyState
            isCompact
            action={
              <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={loginHref}>
                {t('loginAction')}
              </Link>
            }
            description={t('signedOutText')}
            icon={<LogIn size={16} />}
            title={t('signedOutTitle')}
          />
        ) : (
          <PlusGate feature='analytics'>
            {match(status)
              .with('pending', () => <Skeleton height={MY_MODE.skeletonHeight} shape='block' />)
              .with('noAccount', () => (
                <EmptyState
                  isCompact
                  action={
                    <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.overview}>
                      {t('linkAction')}
                    </Link>
                  }
                  description={t('noAccountText')}
                  icon={<Link2 size={16} />}
                  title={t('noAccountTitle')}
                />
              ))
              .with('error', () => <ErrorState isCompact isRetrying={isRetrying} onRetry={onRetry} />)
              .with('empty', () => <EmptyState isCompact description={t('emptyText', { days })} title={t('emptyTitle')} />)
              .with('ready', () => line && <MyModeLineView line={line} tanks={tanks} />)
              .exhaustive()}
          </PlusGate>
        )}
      </div>
    </Card>
  );
};
