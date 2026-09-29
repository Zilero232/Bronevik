import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
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
        items={MOD_FAQ.map((id) => ({
          id,
          question: t(`items.${id}.question`),
          answer: (
            <>
              {t(`items.${id}.answer`)}
              {id === 'replays' && (
                <Link className={s.link} href={ROUTES.replays.list}>
                  {t('replaysLink')}
                </Link>
              )}
              {(id === 'bind' || id === 'delete') && (
                <Link className={s.link} href={ROUTES.account.overview}>
                  {t('accountLink')}
                </Link>
              )}
            </>
          )
        }))}
      />
    </section>
  );
};
