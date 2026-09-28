'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { ArmorIntroProps } from './ArmorIntro.types';

import s from './ArmorIntro.module.scss';

export const ArmorIntro = ({ slug }: ArmorIntroProps) => {
  const t = useTranslations('armor.page');

  return (
    <p className={s.root}>
      {t.rich('intro', {
        link: (chunks) => (
          <Link className={s.link} href={ROUTES.tanks.detail(slug)}>
            {chunks}
          </Link>
        )
      })}
    </p>
  );
};
