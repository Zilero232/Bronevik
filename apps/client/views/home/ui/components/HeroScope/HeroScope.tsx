'use client';

import { AnimatedLogo } from '@bronevik/icons';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { SCALE_IN } from '@/shared/lib';

import { SCOPE, SCOPE_BLIPS, SCOPE_TICKS } from './HeroScope.constants';

import s from './HeroScope.module.scss';

export const HeroScope = () => {
  const t = useTranslations('home.scope');

  return (
    <motion.div aria-hidden animate='visible' className={s.root} initial='hidden' variants={SCALE_IN}>
      <div className={s.sweep} />
      <svg className={s.svg} viewBox={`0 0 ${SCOPE.size} ${SCOPE.size}`}>
        <circle className={s.ring} cx={SCOPE.center} cy={SCOPE.center} r={SCOPE.outer} />
        <circle className={s.ringInner} cx={SCOPE.center} cy={SCOPE.center} r={SCOPE.inner} />
        {SCOPE_TICKS.map((tick) => (
          <line
            key={tick.angle}
            className={tick.isMajor ? s.tickMajor : s.tick}
            transform={`rotate(${tick.angle} ${SCOPE.center} ${SCOPE.center})`}
            x1={SCOPE.center}
            x2={SCOPE.center}
            y1={SCOPE.center - SCOPE.outer}
            y2={SCOPE.center - SCOPE.outer + (tick.isMajor ? 14 : 6)}
          />
        ))}
        <motion.g
          animate={{ rotate: 360 }}
          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <circle className={s.dashed} cx={SCOPE.center} cy={SCOPE.center} r={SCOPE.dashed} />
        </motion.g>
        <path className={s.cross} d='M200 30v120M200 250v120M30 200h120M250 200h120' />
        <path className={s.chevron} d='M184 262l16-12 16 12M176 280l24-18 24 18' />
        {SCOPE_BLIPS.map((blip, index) => (
          <g key={blip.id}>
            <motion.circle
              animate={{ scale: [1, 3.6, 1], opacity: [0.9, 0, 0.9] }}
              className={s.blipPulse}
              cx={blip.x}
              cy={blip.y}
              r={3}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.6 }}
            />
            <circle className={s.blip} cx={blip.x} cy={blip.y} r={3} />
            <text className={s.blipLabel} x={blip.x + 10} y={blip.y - 8}>
              {blip.label}
            </text>
          </g>
        ))}
      </svg>
      <div className={s.center}>
        <AnimatedLogo size={112} strokeWidth={1.25} />
      </div>
      <span className={clsx(s.readout, s.topLeft)}>{t('range', { value: 445 })}</span>
      <span className={clsx(s.readout, s.topRight)}>{t('bearing', { value: '042' })}</span>
      <span className={clsx(s.readout, s.bottomLeft)}>{t('zoom', { value: 8 })}</span>
      <span className={clsx(s.readout, s.bottomRight)}>{t('status')}</span>
    </motion.div>
  );
};
