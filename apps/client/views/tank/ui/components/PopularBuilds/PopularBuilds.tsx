'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { buildKey } from '@/entities/tank/build';
import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { SectionHeader, Skeleton } from '@/ui-kit';

import { TANK_SECTIONS } from '../../../config';
import { usePopularBuilds } from '../../../model/hooks';
import { RevealSection } from '../RevealSection';
import { SectionNotice } from '../SectionNotice';
import { BuildCard } from './components';

import s from './PopularBuilds.module.scss';

const SKELETON_CARDS = 3;

export const PopularBuilds = () => {
  const t = useTranslations('tank.builds');
  const { data, isPending, isError } = usePopularBuilds();

  return (
    <RevealSection id={TANK_SECTIONS.builds}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 04' title={t('title')} />
      {match({ list: data?.builds ?? [], source: data?.source ?? 'none', isPending, isError })
        .with({ isPending: true }, () => (
          <div className={s.grid}>
            {Array.from({ length: SKELETON_CARDS }, (_, index) => (
              <Skeleton key={index} height={360} shape='block' width='100%' />
            ))}
          </div>
        ))
        .with({ isError: true }, () => <SectionNotice kind='error' />)
        .with({ list: [] }, () => <SectionNotice description={t('emptyDescription')} kind='empty' title={t('emptyTitle')} />)
        .otherwise(({ list, source }) => (
          <motion.ul className={s.grid} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
            {list.map((build, index) => (
              <motion.li key={buildKey(build)} className={s.item} variants={STAGGER_ITEM}>
                <BuildCard build={build} rank={index + 1} source={source} />
              </motion.li>
            ))}
          </motion.ul>
        ))}
    </RevealSection>
  );
};
