'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { GOLD } from '../../../../../config';
import { goldToCredits, goldToFreeXp } from '../../../../../lib/gold-conversion';

import s from './GoldBundles.module.scss';

export const GoldBundles = () => {
  const t = useTranslations('tools.gold.bundles');
  const format = useFormatter();

  return (
    <table className={s.root}>
      <caption className={s.caption}>{t('caption')}</caption>
      <thead>
        <tr>
          <th scope='col'>{t('gold')}</th>
          <th scope='col'>{t('credits')}</th>
          <th scope='col'>{t('xp')}</th>
        </tr>
      </thead>
      <tbody>
        {GOLD.bundles.map((bundle) => (
          <tr key={bundle}>
            <th scope='row'>{format.number(bundle)}</th>
            <td>{format.number(goldToCredits(bundle))}</td>
            <td>{format.number(goldToFreeXp(bundle))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
