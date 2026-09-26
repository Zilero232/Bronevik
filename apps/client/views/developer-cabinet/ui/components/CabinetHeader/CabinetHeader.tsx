'use client';

import { API_KEY } from '@bronevik/schemas';
import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { STAGGER_ITEM } from '@/shared/lib';
import { buttonVariants, Skeleton } from '@/ui-kit';

import { useDeveloperOverview } from '../../../model/hooks';

import s from './CabinetHeader.module.scss';

export const CabinetHeader = () => {
  const t = useTranslations('developer.header');
  const format = useFormatter();
  const { data: overview, isError } = useDeveloperOverview();

  const readouts =
    overview &&
    ([
      { key: 'perDay', value: format.number(overview.limits.requestsPerDay) },
      { key: 'perSecond', value: format.number(overview.limits.requestsPerSecond) },
      { key: 'keys', value: `${overview.keys.length} / ${API_KEY.maxActivePerUser}` },
      { key: 'webhooks', value: `${overview.webhooks} / ${overview.limits.webhooks}` }
    ] as const);

  return (
    <motion.header className={s.root} variants={STAGGER_ITEM}>
      <div className={s.copy}>
        <span className={s.eyebrow}>{t('eyebrow')}</span>
        <h1 className={s.title}>{t('title')}</h1>
        <p className={s.lead}>{t('lead')}</p>
        <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.developers}>
          <BookOpen size={15} />
          {t('docs')}
        </Link>
      </div>
      <div className={s.tag}>
        <span className={s.tagLabel}>{t('plan')}</span>
        {overview && <span className={s.plan}>{t(`planName.${overview.plan}`)}</span>}
        {!overview && isError && <span className={s.plan}>—</span>}
        {!overview && !isError && <Skeleton height={40} shape='block' width={120} />}
        <dl className={s.readouts}>
          {readouts?.map(({ key, value }) => (
            <div key={key} className={s.readout}>
              <dt className={s.readoutLabel}>{t(`readouts.${key}`)}</dt>
              <dd className={s.readoutValue}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.header>
  );
};
