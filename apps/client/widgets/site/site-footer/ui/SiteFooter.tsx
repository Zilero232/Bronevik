import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { LocaleSwitcher } from '@/features/app/switch-locale';
import { env, EXTERNAL_LINKS, SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import s from './SiteFooter.module.scss';

export const SiteFooter = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className={s.root}>
      <div className={s.inner}>
        <p className={s.legal}>
          <span>{t('lestaCopyright')}</span>
          <span>
            {t('dataSource')}{' '}
            <a className={s.link} href={EXTERNAL_LINKS.game} rel='noreferrer' target='_blank'>
              tanki.su
            </a>
          </span>
          <a className={s.link} href={EXTERNAL_LINKS.lestaSupport} rel='noreferrer' target='_blank'>
            {t('support')}
          </a>
          <span className={s.disclaimer}>{t('disclaimer')}</span>
        </p>
        <div className={s.meta}>
          <span className={s.copyright}>
            {t('copyright', { year: SITE.copyrightYear })} · v{env.NEXT_PUBLIC_APP_VERSION}
          </span>
          <nav aria-label={t('project')} className={s.links}>
            <Link className={s.link} href={ROUTES.developers}>
              {t('api')}
            </Link>
            <Link className={s.link} href={ROUTES.streamers}>
              {t('streamers')}
            </Link>
            <Link className={s.link} href={ROUTES.design}>
              {tNav('design')}
            </Link>
          </nav>
          <Suspense>
            <LocaleSwitcher className={s.locale} />
          </Suspense>
        </div>
      </div>
    </footer>
  );
};
