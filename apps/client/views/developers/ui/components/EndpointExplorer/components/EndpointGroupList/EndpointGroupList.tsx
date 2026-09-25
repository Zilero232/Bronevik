'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import type { EndpointGroupListProps } from './EndpointGroupList.types';

import { EndpointRow } from '../EndpointRow';

import s from './EndpointGroupList.module.scss';

export const EndpointGroupList = ({ groups }: EndpointGroupListProps) => {
  const t = useTranslations('developers.explorer');

  return (
    <motion.div animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      {groups.map(({ tag, label, endpoints }) => (
        <motion.section key={tag} aria-label={label} className={s.group} variants={STAGGER_ITEM}>
          <h3 className={s.title}>
            <span className={s.label}>{label}</span>
            <span className={s.count}>{t('count', { count: endpoints.length })}</span>
          </h3>
          <ul className={s.list}>
            {endpoints.map((endpoint) => (
              <EndpointRow key={endpoint.id} endpoint={endpoint} />
            ))}
          </ul>
        </motion.section>
      ))}
    </motion.div>
  );
};
