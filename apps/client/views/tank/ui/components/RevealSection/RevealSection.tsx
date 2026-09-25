'use client';

import { motion } from 'motion/react';

import { REVEAL_VIEWPORT, SLIDE_UP } from '@/shared/lib';

import type { RevealSectionProps } from './RevealSection.types';

import s from './RevealSection.module.scss';

export const RevealSection = ({ id, children }: RevealSectionProps) => (
  <motion.section className={s.root} id={id} initial='hidden' variants={SLIDE_UP} viewport={REVEAL_VIEWPORT} whileInView='visible'>
    {children}
  </motion.section>
);
