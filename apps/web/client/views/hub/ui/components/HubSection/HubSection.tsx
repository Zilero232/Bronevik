'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';

import { MOTION_VARIANTS } from '@/shared/lib';
import { Reveal } from '@/ui-kit';

import type { HubSectionProps } from './HubSection.types';

import { HubCard } from '../HubCard';

import s from './HubSection.module.scss';

export const HubSection = ({ section, order }: HubSectionProps) => (
  <Reveal as='section' className={s.root} order={order}>
    <h2 className={s.title} id={`hub-${section.key}`}>
      {section.title}
    </h2>
    <ul aria-labelledby={`hub-${section.key}`} className={s.grid}>
      <AnimatePresence initial={false} mode='popLayout'>
        {section.items.map((item) => (
          <m.li layout key={item.key} animate='shown' className={s.item} exit='exit' initial='hidden' variants={MOTION_VARIANTS.listItem}>
            <HubCard item={item} />
          </m.li>
        ))}
      </AnimatePresence>
    </ul>
  </Reveal>
);
