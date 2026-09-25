import { BronevikLogoIcon } from '@bronevik/icons';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { env, EXTERNAL_LINKS, SITE } from '@/shared/config';
import { ROUTES, SITE_NAV } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import s from './SiteFooter.module.scss';

export const SiteFooter = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className={s.root}>
      <div className={s.inner}>
        <div className={s.brand}>
          <span className={s.logo}>
            <BronevikLogoIcon size={28} strokeWidth={1.75} />
            {t('brand')}
          </span>
          <p className={s.tagline}>{t('tagline')}</p>
        </div>
        <nav aria-label={t('sections')} className={s.column}>
          <span className={s.heading}>{t('sections')}</span>
          {SITE_NAV.map((item) => (
            <Link key={item.key} className={s.link} href={item.href}>
              {tNav(item.key)}
            </Link>
          ))}
        </nav>
        <div className={s.column}>
          <span className={s.heading}>{t('project')}</span>
          <Link className={s.link} href={ROUTES.design}>
            {tNav('design')}
          </Link>
          <Link className={s.link} href={ROUTES.developers}>
            {t('api')}
          </Link>
          <a className={s.link} href={EXTERNAL_LINKS.game} rel='noreferrer' target='_blank'>
            {t('game')} <ExternalLink size={12} />
          </a>
          <a className={s.link} href={EXTERNAL_LINKS.lestaSupport} rel='noreferrer' target='_blank'>
            {t('support')} <ExternalLink size={12} />
          </a>
        </div>
      </div>
      <div className={s.legal}>
        <div className={s.attribution}>
          <p>{t('lestaCopyright')}</p>
          <p>
            {t('dataSource')}{' '}
            <a className={s.inline} href={EXTERNAL_LINKS.game} rel='noreferrer' target='_blank'>
              tanki.su
            </a>
          </p>
          <p className={s.disclaimer}>{t('disclaimer')}</p>
        </div>
        <p className={s.copyright}>
          {t('copyright', { year: SITE.copyrightYear })} · v{env.NEXT_PUBLIC_APP_VERSION}
        </p>
      </div>
    </footer>
  );
};
