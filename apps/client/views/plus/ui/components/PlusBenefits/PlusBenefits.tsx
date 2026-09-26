import { useTranslations } from 'next-intl';

import { Badge, SectionHeader } from '@/ui-kit';

import { PLUS_BENEFITS } from '../../../config';

import s from './PlusBenefits.module.scss';

export const PlusBenefits = () => {
  const t = useTranslations('plus.benefits');

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} title={t('title')} />
      <ul className={s.cards}>
        {PLUS_BENEFITS.featured.map(({ id, icon: Icon }) => (
          <li key={id} className={s.card}>
            <div className={s.media}>
              <Icon aria-hidden className={s.glyph} size={96} strokeWidth={1.25} />
              <p className={s.plate}>
                <span className={s.plateTitle}>{t(`items.${id}.title`)}</span>
                <span className={s.plateSub}>{t('live')}</span>
              </p>
            </div>
            <p className={s.cardText}>{t(`items.${id}.text`)}</p>
          </li>
        ))}
      </ul>
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
