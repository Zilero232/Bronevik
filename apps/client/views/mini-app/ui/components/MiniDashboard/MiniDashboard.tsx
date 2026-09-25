'use client';

import { Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState } from '@/ui-kit';

import { primaryAccount } from '../../../lib/dashboard-picks';
import { openExternally } from '../../../lib/open-externally';
import { useLinkedAccounts } from '../../../model/hooks';
import { MiniSkeleton } from '../MiniSkeleton';
import { PlayerDashboard } from '../PlayerDashboard';

export const MiniDashboard = () => {
  const t = useTranslations('tg.noAccount');
  const { data: accounts, isPending } = useLinkedAccounts();

  const account = primaryAccount(accounts?.lesta ?? []);

  return match({ isPending, account })
    .with({ isPending: true }, () => <MiniSkeleton />)
    .with({ account: null }, () => (
      <EmptyState
        action={
          <Link className={buttonVariants({ size: 'lg' })} href={ROUTES.me} onClick={openExternally}>
            <Link2 size={18} />
            {t('action')}
          </Link>
        }
        description={t('description')}
        title={t('title')}
      />
    ))
    .with({ account: P.nonNullable }, ({ account: linked }) => <PlayerDashboard accountId={linked.accountId} nickname={linked.nickname} />)
    .exhaustive();
};
