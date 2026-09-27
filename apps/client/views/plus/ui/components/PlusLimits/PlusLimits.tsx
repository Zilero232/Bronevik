import { PLUS_LIMITS } from '@otmetki/schemas';
import { useFormatter, useTranslations } from 'next-intl';
import { entries } from 'remeda';
import { match, P } from 'ts-pattern';

import { SectionHeader } from '@/ui-kit';

import { PLUS_LIMIT_TIERS } from '../../../config';

import s from './PlusLimits.module.scss';

export const PlusLimits = () => {
  const t = useTranslations('plus.limits');
  const format = useFormatter();

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} title={t('title')} />
      <table className={s.table}>
        <thead>
          <tr>
            <th scope='col'>{t('feature')}</th>
            <th scope='col'>{t('free')}</th>
            <th className={s.plus} scope='col'>
              {t('plus')}
            </th>
          </tr>
        </thead>
        <tbody>
          {entries(PLUS_LIMITS).map(([key, limit]) => (
            <tr key={key}>
              <th scope='row'>{t(`rows.${key}`)}</th>
              {PLUS_LIMIT_TIERS.map((tier) => (
                <td key={tier} className={tier === 'plus' ? s.plus : undefined}>
                  {match(limit[tier])
                    .with(null, () => t('unlimited'))
                    .with(P.number, (count) => format.number(count))
                    .otherwise(({ per, count }) => t(`rate.${per}`, { count }))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
