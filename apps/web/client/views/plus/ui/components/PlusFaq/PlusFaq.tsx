import { PLUS_TRIAL } from '@otmetki/schemas';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import type { PlusFaqProps } from './PlusFaq.types';

import { PLUS_FAQ } from '../../../config';

import s from './PlusFaq.module.scss';

export const PlusFaq = ({ trialDays }: PlusFaqProps) => {
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
            <p className={s.answer}>
              {id === 'trial' ? t('items.trial.answer', { days: trialDays, referralDays: PLUS_TRIAL.referralDays }) : t(`items.${id}.answer`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};
