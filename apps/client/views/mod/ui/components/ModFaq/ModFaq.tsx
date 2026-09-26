import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { SectionHeader } from '@/ui-kit';

import { MOD_FAQ } from '../../../config';

import s from './ModFaq.module.scss';

export const ModFaq = () => {
  const t = useTranslations('mod.faq');

  return (
    <section className={s.root}>
      <SectionHeader title={t('title')} variant='display' />
      <div className={s.list}>
        {MOD_FAQ.map((id) => (
          <details key={id} className={s.item}>
            <summary className={s.question}>
              {t(`items.${id}.question`)}
              <ChevronDown aria-hidden className={s.chevron} size={16} />
            </summary>
            <p className={s.answer}>
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
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};
