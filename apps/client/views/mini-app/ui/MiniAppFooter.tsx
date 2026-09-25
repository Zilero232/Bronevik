import { useTranslations } from 'next-intl';

import { EXTERNAL_LINKS } from '@/shared/config';

import s from './MiniAppFooter.module.scss';

export const MiniAppFooter = () => {
  const t = useTranslations('footer');

  return (
    <footer className={s.root}>
      <p>{t('lestaCopyright')}</p>
      <p>
        {t('dataSource')}{' '}
        <a className={s.link} href={EXTERNAL_LINKS.game} rel='noreferrer' target='_blank'>
          tanki.su
        </a>
      </p>
      <p className={s.disclaimer}>{t('disclaimer')}</p>
    </footer>
  );
};
