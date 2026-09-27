'use client';

import { Link2, Lock, LogIn, ShieldPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { WorkspaceNoticeProps } from './WorkspaceNotice.types';

import { WORKSPACE_VIEW } from '../../../config';

export const WorkspaceNotice = ({ status, clanTag, loginHref, canCreate, isCreating, isRetrying, onCreate, onRetry }: WorkspaceNoticeProps) => {
  const t = useTranslations('clanWorkspace');

  return match(status)
    .with('pending', () => <Skeleton height={WORKSPACE_VIEW.skeletonHeight} shape='block' />)
    .with('guest', () => (
      <EmptyState
        action={
          <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={loginHref}>
            <LogIn aria-hidden size={14} />
            {t('guest.action')}
          </Link>
        }
        description={t('guest.description')}
        icon={<LogIn aria-hidden size={28} />}
        title={t('guest.title')}
      />
    ))
    .with('outsider', () => (
      <EmptyState
        action={
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.overview}>
            <Link2 aria-hidden size={14} />
            {t('outsider.action')}
          </Link>
        }
        description={t('outsider.description', { tag: clanTag })}
        icon={<Lock aria-hidden size={28} />}
        title={t('outsider.title')}
      />
    ))
    .with('forbidden', () => (
      <EmptyState description={t('forbidden.description')} icon={<Lock aria-hidden size={28} />} title={t('forbidden.title')} />
    ))
    .with('missing', () => (
      <EmptyState
        action={
          canCreate && (
            <Button disabled={isCreating} size='sm' onClick={onCreate}>
              <ShieldPlus aria-hidden size={14} />
              {t('missing.action')}
            </Button>
          )
        }
        description={canCreate ? t('missing.ownerDescription') : t('missing.description')}
        icon={<ShieldPlus aria-hidden size={28} />}
        title={t('missing.title')}
      />
    ))
    .with('error', () => <ErrorState isRetrying={isRetrying} onRetry={onRetry} />)
    .exhaustive();
};
