import { OtmetkiLogoIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { LocaleSwitcher } from '@/features/app/switch-locale';
import { env, EXTERNAL_LINKS, SITE } from '@/shared/config';
import { ROUTES, SITE_FOOTER_COLUMNS, SITE_LEGAL_LINKS } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import s from './SiteFooter.module.scss';

export const SiteFooter = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tBrand = useTranslations('brand');
  const tLegal = useTranslations('legal.footer');

  return (
    <footer className={s.root}>
      <div className={s.inner}>
        <div className={s.top}>
          <div className={s.about}>
            <Link className={s.brand} href={ROUTES.home}>
              <OtmetkiLogoIcon className={s.mark} size={28} strokeWidth={2} />
              <span className={s.word}>{tBrand('name')}</span>
            </Link>
            <p className={s.aboutText}>{t('about')}</p>
          </div>
          <nav aria-label={t('label')} className={s.columns}>
            {SITE_FOOTER_COLUMNS.map((group) => (
              <section key={group.key} className={s.column} data-long={group.items.length > 8 || undefined}>
                <h2 className={s.heading}>{tNav(`groups.${group.key}`)}</h2>
                <ul className={s.list}>
                  {group.items.map((item) => (
                    <li key={item.key}>
                      <Link className={s.columnLink} href={item.href}>
                        {tNav(`items.${item.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>
        <div className={s.bar}>
          <nav aria-label={t('legalLabel')} className={s.docs}>
            {SITE_LEGAL_LINKS.map((item) => (
              <Link key={item.key} className={s.link} href={item.href}>
                {tLegal(item.key)}
              </Link>
            ))}
            <a className={s.link} href={EXTERNAL_LINKS.lestaSupport} rel='noreferrer' target='_blank'>
              {t('support')}
            </a>
          </nav>
          <Suspense>
            <LocaleSwitcher />
          </Suspense>
        </div>
        <p className={s.legal}>
          <span>{t('lestaCopyright')}</span>
          <span>
            {t('dataSource')}{' '}
            <a className={s.link} href={EXTERNAL_LINKS.game} rel='noreferrer' target='_blank'>
              {t('gameSite')}
            </a>
          </span>
          <span>{t('disclaimer')}</span>
          <span className={s.copyright}>
            {t('copyright', { year: SITE.copyrightYear })} · v{env.NEXT_PUBLIC_APP_VERSION}
          </span>
        </p>
      </div>
    </footer>
  );
};
