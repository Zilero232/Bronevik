'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { OutsideNotice } from '../OutsideNotice';

export const OutsideVk = () => {
  const t = useTranslations('tg.vkOutside');

  return (
    <OutsideNotice description={t('description')} title={t('title')}>
      <Link className={buttonVariants({ block: true })} href={ROUTES.home}>
        {t('site')}
      </Link>
    </OutsideNotice>
  );
};
