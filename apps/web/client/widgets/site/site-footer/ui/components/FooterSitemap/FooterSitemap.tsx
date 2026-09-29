import { useTranslations } from 'next-intl';

import { SITE_FOOTER_COLUMNS } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import s from './FooterSitemap.module.scss';

export const FooterSitemap = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <nav aria-label={t('label')} className={s.root}>
      {SITE_FOOTER_COLUMNS.map((group) => (
        <section key={group.key} aria-labelledby={`footer-${group.key}`} className={s.column}>
          <h2 className={s.heading} id={`footer-${group.key}`}>
            {tNav(`groups.${group.key}`)}
          </h2>
          <ul className={s.list}>
            {group.items.map((item) => (
              <li key={item.key}>
                <Link className={s.link} href={item.href}>
                  {tNav(`items.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
};
