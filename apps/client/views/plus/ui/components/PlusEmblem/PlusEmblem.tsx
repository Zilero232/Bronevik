'use client';

import { clsx } from 'clsx';
import { motion } from 'motion/react';

import { useSvgId } from '@/shared/lib';

import type { PlusEmblemProps } from './PlusEmblem.types';

import { EMBLEM } from './PlusEmblem.constants';
import { LAUREL_LEAVES, STEM_PATH } from './PlusEmblem.helpers';
import { EMBLEM_MOTION } from './PlusEmblem.motion';

import s from './PlusEmblem.module.scss';

export const PlusEmblem = ({ className }: PlusEmblemProps) => {
  const gold = useSvgId('plus-gold');
  const face = useSvgId('plus-face');

  const branch = (
    <>
      <motion.path className={s.stem} d={STEM_PATH} stroke={`url(#${gold})`} variants={EMBLEM_MOTION.stem} />
      {LAUREL_LEAVES.map(({ id, x, y, rotate, scale }) => (
        <g key={id} transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
          <motion.path d={EMBLEM.leafPath} transform={`rotate(${-EMBLEM.leafTilt})`} variants={EMBLEM_MOTION.leaf} />
          <motion.path d={EMBLEM.leafPath} transform={`rotate(${EMBLEM.leafTilt})`} variants={EMBLEM_MOTION.leaf} />
        </g>
      ))}
    </>
  );

  return (
    <motion.svg
      aria-hidden
      animate='visible'
      className={clsx(s.root, className)}
      initial='hidden'
      variants={EMBLEM_MOTION.wreath}
      viewBox={`0 0 ${EMBLEM.size} ${EMBLEM.size}`}
    >
      <defs>
        <linearGradient id={gold} x1='0' x2='1' y1='0' y2='1'>
          <stop className={s.stopLight} offset='0' />
          <stop className={s.stopMid} offset='0.45' />
          <stop className={s.stopDeep} offset='1' />
        </linearGradient>
        <radialGradient cx='0.38' cy='0.32' id={face} r='0.8'>
          <stop className={s.faceLight} offset='0' />
          <stop className={s.faceDeep} offset='1' />
        </radialGradient>
      </defs>
      <g className={s.ribbons}>
        <path d={EMBLEM.ribbonLeft} />
        <path d={EMBLEM.ribbonRight} />
      </g>
      <g fill={`url(#${gold})`}>
        <g>{branch}</g>
        <g transform={EMBLEM.mirror}>{branch}</g>
      </g>
      <motion.g className={s.medal} variants={EMBLEM_MOTION.medal}>
        <circle cx={EMBLEM.center} cy={EMBLEM.center} fill={`url(#${gold})`} r='62' />
        <circle cx={EMBLEM.center} cy={EMBLEM.center} fill={`url(#${face})`} r='55' />
        <circle className={s.engrave} cx={EMBLEM.center} cy={EMBLEM.center} r='48' />
        <polygon className={s.cross} fill={`url(#${gold})`} points={EMBLEM.cross} />
      </motion.g>
      <path className={s.star} d={EMBLEM.star} fill={`url(#${gold})`} />
    </motion.svg>
  );
};
