import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState } from '@/ui-kit';

import s from './NotFoundView.module.scss';

export const NotFoundView = () => {
  const t = useTranslations('notFound');

  return (
    <section className={s.root}>
      <EmptyState
        action={
          <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.home}>
            {t('home')}
          </Link>
        }
        description={t('body')}
        title={t('title')}
      />
    </section>
  );
};
