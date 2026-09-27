'use client';

import { Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState } from '@/ui-kit';

export const NoAccountState = () => {
  const t = useTranslations('analytics.state');

  return (
    <EmptyState
      action={
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.overview}>
          {t('linkAction')}
        </Link>
      }
      description={t('noAccountText')}
      icon={<Link2 size={16} />}
      title={t('noAccountTitle')}
    />
  );
};
