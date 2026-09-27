import { useTranslations } from 'next-intl';

import { CommandPaletteTrigger } from '@/features/search/command-palette';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState } from '@/ui-kit';

import { QUICK_LINKS } from '../config';

import s from './NotFoundView.module.scss';

export const NotFoundView = () => {
  const t = useTranslations('notFound');
  const tNav = useTranslations('nav.items');

  return (
    <section className={s.root}>
      <EmptyState
        action={
          <div className={s.body}>
            <div className={s.actions}>
              <CommandPaletteTrigger />
              <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.home}>
                {t('home')}
              </Link>
            </div>
            <nav aria-label={t('popular')}>
              <ul className={s.links}>
                {QUICK_LINKS.map((item) => (
                  <li key={item.key}>
                    <Link className={s.link} href={item.href}>
                      <item.icon aria-hidden size={16} />
                      {tNav(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        }
        description={t('body')}
        icon={<span className={s.code}>{t('code')}</span>}
        title={t('title')}
      />
    </section>
  );
};
