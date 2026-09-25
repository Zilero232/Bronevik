import { AnimatedLogo } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import s from './SiteBrand.module.scss';

export const SiteBrand = () => {
  const t = useTranslations('brand');

  return (
    <Link aria-label={t('home')} className={s.root} href={ROUTES.home}>
      <span className={s.mark}>
        <AnimatedLogo size={30} strokeWidth={1.75} />
      </span>
      <span className={s.text}>
        <span className={s.word}>{t('name')}</span>
        <span className={s.tag}>{t('tag')}</span>
      </span>
    </Link>
  );
};
