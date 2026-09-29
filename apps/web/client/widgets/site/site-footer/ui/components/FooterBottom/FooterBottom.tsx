import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { env, EXTERNAL_LINKS, SITE } from '@/shared/config';
import { SITE_LEGAL_LINKS } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import s from './FooterBottom.module.scss';

export const FooterBottom = () => {
  const t = useTranslations('footer');
  const tLegal = useTranslations('legal.footer');

  return (
    <div className={s.root}>
      <div className={s.row}>
        <nav aria-label={t('legalLabel')} className={s.docs}>
          {SITE_LEGAL_LINKS.map((item) => (
            <Link key={item.key} className={s.link} href={item.href}>
              {tLegal(item.key)}
            </Link>
          ))}
          <a className={s.link} href={EXTERNAL_LINKS.lestaSupport} rel='noreferrer' target='_blank'>
            {t('support')}
            <ArrowUpRight aria-hidden size={14} />
          </a>
        </nav>
        <p className={s.meta}>
          <span>{t('copyright', { year: SITE.copyrightYear })}</span>
          <span className={s.version}>{t('version', { version: env.NEXT_PUBLIC_APP_VERSION })}</span>
        </p>
      </div>
      <p className={s.attribution}>
        <span>{t('lestaCopyright')}</span>
        <span>
          {t('dataSource')}{' '}
          <a className={s.source} href={EXTERNAL_LINKS.game} rel='noreferrer' target='_blank'>
            {t('gameSite')}
          </a>
        </span>
        <span>{t('disclaimer')}</span>
      </p>
    </div>
  );
};
