'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { match } from 'ts-pattern';

import { GuideStatusBadge } from '@/features/community/guide-meta';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, EmptyState, ErrorState, RelativeTime } from '@/ui-kit';

import { useMyGuides } from '../../../model/hooks';
import { SideListSkeleton } from '../SideListSkeleton';

import s from './MyGuides.module.scss';

export const MyGuides = () => {
  const t = useTranslations('guides.mine');
  const titleId = useId();
  const { isSignedIn, guides, isPending, isError, isRetrying, retry } = useMyGuides();

  if (!isSignedIn) {
    return null;
  }

  return (
    <Card aria-labelledby={titleId} padding='none'>
      <CardHeader meta={guides.length > 0 ? guides.length : undefined} title={<span id={titleId}>{t('title')}</span>} />
      {match({ isPending, isError, isEmpty: guides.length === 0 })
        .with({ isPending: true }, () => <SideListSkeleton />)
        .with({ isError: true }, () => <ErrorState isCompact isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />)
        .with({ isEmpty: true }, () => (
          <EmptyState
            isCompact
            action={
              <Link className={buttonVariants({ size: 'sm', variant: 'secondary' })} href={ROUTES.guides.create}>
                {t('write')}
              </Link>
            }
            description={t('emptyDescription')}
            title={t('emptyTitle')}
          />
        ))
        .otherwise(() => (
          <ul className={s.list}>
            {guides.map((guide) => (
              <li key={guide.id} className={s.row}>
                <div className={s.main}>
                  <Link className={s.title} href={ROUTES.guides.detail(guide.slug)}>
                    {guide.title}
                  </Link>
                  <span className={s.meta}>
                    <GuideStatusBadge status={guide.status} />
                    <RelativeTime value={guide.updatedAt} />
                  </span>
                </div>
                <Link aria-label={t('edit')} className={buttonVariants({ size: 'sm', variant: 'ghost' })} href={ROUTES.guides.edit(guide.slug)}>
                  <Pencil size={14} />
                </Link>
              </li>
            ))}
          </ul>
        ))}
    </Card>
  );
};
