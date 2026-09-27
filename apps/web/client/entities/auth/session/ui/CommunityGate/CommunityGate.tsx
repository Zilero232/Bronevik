'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Skeleton } from '@/ui-kit';

import type { CommunityGateProps } from './CommunityGate.types';

import { useCommunityViewer, useLoginHref } from '../../model/hooks';

import s from './CommunityGate.module.scss';

export const CommunityGate = ({ children, requiresLesta = true, className }: CommunityGateProps) => {
  const loginHref = useLoginHref();
  const t = useTranslations('community.gate');
  const { isPending, isSignedIn, hasLesta } = useCommunityViewer();

  if (isPending) {
    return <Skeleton className={className} height={32} width={160} />;
  }

  if (!isSignedIn) {
    return (
      <div className={clsx(s.root, className)}>
        <span className={s.hint}>{t('signInHint')}</span>
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={loginHref}>
          {t('signIn')}
        </Link>
      </div>
    );
  }

  if (requiresLesta && !hasLesta) {
    return (
      <div className={clsx(s.root, className)}>
        <span className={s.hint}>{t('linkLestaHint')}</span>
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.overview}>
          {t('linkLesta')}
        </Link>
      </div>
    );
  }

  return children;
};
