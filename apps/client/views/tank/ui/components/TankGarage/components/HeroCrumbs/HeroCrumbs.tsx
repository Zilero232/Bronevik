'use client';

import { toRoman } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import { useTank } from '../../../../../model/context';

import s from './HeroCrumbs.module.scss';

export const HeroCrumbs = () => {
  const t = useTranslations('tank.garage');
  const tGame = useTranslations('game');
  const { identity } = useTank();

  return (
    <nav aria-label={t('breadcrumbLabel')} className={s.root}>
      <ol className={s.list}>
        <li className={s.item}>
          <Link className={s.link} href={ROUTES.tanks.list}>
            {t('crumbTanks')}
          </Link>
        </li>
        <li className={s.item}>{tGame(`nations.${identity.nation}`)}</li>
        <li className={s.item}>{tGame(`classes.${identity.type}`)}</li>
        <li data-last className={s.item}>
          {t('crumbTier', { tier: toRoman(identity.tier) })}
        </li>
      </ol>
    </nav>
  );
};
