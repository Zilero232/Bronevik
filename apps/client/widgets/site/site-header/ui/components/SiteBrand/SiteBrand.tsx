import { BronevikLogoIcon } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import s from './SiteBrand.module.scss';

export const SiteBrand = () => {
  const t = useTranslations('brand');

  return (
    <Link aria-label={t('home')} className={s.root} href={ROUTES.home}>
      <BronevikLogoIcon className={s.mark} size={22} strokeWidth={1.75} />
      <span className={s.word}>{t('name')}</span>
    </Link>
  );
};
