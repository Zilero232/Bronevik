import { useTranslations } from 'next-intl';

import { Badge, SectionHeader } from '@/ui-kit';

import { PLUS_BENEFITS } from '../../../config';

import s from './PlusBenefits.module.scss';

export const PlusBenefits = () => {
  const t = useTranslations('plus.benefits');

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} title={t('title')} />
      <dl className={s.list}>
        {PLUS_BENEFITS.items.map(({ id, isLive }) => (
          <div key={id} className={s.item} data-live={isLive}>
            <dt className={s.title}>
              {t(`items.${id}.title`)}
              <Badge tone={isLive ? 'success' : 'neutral'}>{t(isLive ? 'live' : 'soon')}</Badge>
            </dt>
            <dd className={s.text}>{t(`items.${id}.text`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
