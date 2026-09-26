import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { PLUS_BENEFITS } from '../../../config';

import s from './PlusBenefits.module.scss';

export const PlusBenefits = () => {
  const t = useTranslations('plus.benefits');

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} title={t('title')} />
      <dl className={s.list}>
        {PLUS_BENEFITS.items.map((id) => (
          <div key={id} className={s.item}>
            <dt className={s.title}>{t(`items.${id}.title`)}</dt>
            <dd className={s.text}>{t(`items.${id}.text`)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
