import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { FaqList, SectionHeader } from '@/ui-kit';

import { MOD_FAQ } from '../../../config';

import s from './ModFaq.module.scss';

export const ModFaq = () => {
  const t = useTranslations('mod.faq');

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} variant='display' />
      <FaqList
        items={MOD_FAQ.map((item) => ({
          id: item.id,
          question: t(`items.${item.id}.question`),
          answer: (
            <>
              {t(`items.${item.id}.answer`)}
              {'link' in item && (
                <Link className={s.link} href={item.link.href}>
                  {t(item.link.label)}
                </Link>
              )}
            </>
          )
        }))}
      />
    </section>
  );
};
