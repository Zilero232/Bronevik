'use client';

import { Download, Link2Off } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { OpenInManager } from '@/features/mod/open-in-manager';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, CopyField, EmptyState, PageHeader, Skeleton } from '@/ui-kit';

import { MOD_PROFILE_PAGE } from '../config';
import { useModProfilePage } from '../model/hooks';

import s from './ModProfilePage.module.scss';

export const ModProfilePage = () => {
  const t = useTranslations('mod.profile');
  const state = useModProfilePage();

  return (
    <div className={s.root}>
      <PageHeader
        breadcrumbs={[{ label: t('crumbs.mod'), href: ROUTES.mod }, { label: t('crumbs.profile') }]}
        description={t('description')}
        title={t('title')}
      />
      {state.status === 'pending' && <Skeleton height={MOD_PROFILE_PAGE.skeletonHeight} shape='block' />}
      {state.status === 'missing' && (
        <EmptyState
          action={
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.mod}>
              <Download aria-hidden size={14} />
              {t('missingAction')}
            </Link>
          }
          description={t('missingDescription')}
          icon={<Link2Off size={MOD_PROFILE_PAGE.iconSize} />}
          title={t('missingTitle')}
        />
      )}
      {state.status === 'ready' && (
        <Card className={s.card} padding='md' variant='panel'>
          <CardHeader title={t('cardTitle')} />
          <CopyField label={t('codeLabel')} tone='accent' value={state.code} />
          <p className={s.note}>{t('managerNote')}</p>
          <OpenInManager size='md' target={{ kind: 'profile', code: state.code }} variant='primary' />
          <p className={s.note}>{t('gameNote')}</p>
        </Card>
      )}
    </div>
  );
};
