'use client';

import { clsx } from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { SITE_NAV_ICONS } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { Card, SectionHeader } from '@/ui-kit';

import { HOME_FEATURES } from '../../../config';

import s from './FeatureGrid.module.scss';

export const FeatureGrid = () => {
  const t = useTranslations('home.features');
  const tNav = useTranslations('nav');

  return (
    <section>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 01' title={t('title')} />
      <motion.div className={s.grid} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
        {HOME_FEATURES.map((feature) => {
          const Icon = SITE_NAV_ICONS[feature.key];

          return (
            <motion.div key={feature.key} className={clsx(feature.isWide && s.wide)} variants={STAGGER_ITEM}>
              <Card isInteractive className={s.card} padding='none'>
                <Link className={s.link} href={feature.href}>
                  <span className={s.top}>
                    <span className={s.index}>{feature.index}</span>
                    <ArrowUpRight className={s.arrow} size={18} />
                  </span>
                  <span className={s.icon}>
                    <Icon size={feature.isWide ? 44 : 34} strokeWidth={1.4} />
                  </span>
                  <span className={s.title}>{tNav(feature.key)}</span>
                  <span className={s.text}>{t(`items.${feature.key}`)}</span>
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
