import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { PLUS_FAQ } from '../../../config';

import s from './PlusFaq.module.scss';

export const PlusFaq = () => {
  const t = useTranslations('plus.faq');

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} />
      <div className={s.list}>
        {PLUS_FAQ.items.map((id) => (
          <details key={id} className={s.item}>
            <summary className={s.question}>
              {t(`items.${id}.question`)}
              <ChevronDown aria-hidden className={s.chevron} size={16} />
            </summary>
            <p className={s.answer}>{t(`items.${id}.answer`)}</p>
          </details>
        ))}
      </div>
    </section>
  );
};
