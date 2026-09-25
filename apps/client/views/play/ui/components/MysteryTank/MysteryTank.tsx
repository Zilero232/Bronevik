'use client';

import { AnimatedMarkOfExcellence, TANK_CLASS_SILHOUETTES } from '@bronevik/icons';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { Burst } from '@/ui-kit';

import { useGuessGame } from '../../../model/context';
import { MARK_POP, NAME_REVEAL, RENDER_REVEAL, SILHOUETTE_TRANSITION, silhouetteBlur } from './MysteryTank.motion';

import s from './MysteryTank.module.scss';

export const MysteryTank = () => {
  const t = useTranslations('play.mystery');
  const { target, clueCount, status } = useGuessGame();

  const Silhouette = TANK_CLASS_SILHOUETTES[target.type];
  const identity = vehicleIdentity(target);
  const isOver = status !== 'playing';
  const blur = isOver ? 0 : silhouetteBlur(clueCount);

  return (
    <figure className={s.root} data-status={status}>
      <div aria-hidden className={s.scope}>
        <span className={s.sweep} />
        <span className={s.cross} />
        <Burst className={s.burst} count={18} radius={120} trigger={status === 'won' ? 1 : 0}>
          <AnimatePresence initial={false} mode='wait'>
            {isOver ? (
              <motion.span key='render' {...RENDER_REVEAL} className={s.render}>
                <TankImage size='big' tank={identity} />
              </motion.span>
            ) : (
              <motion.span
                key='silhouette'
                animate={{ filter: `blur(${blur}px)` }}
                className={s.silhouette}
                exit={{ opacity: 0, scale: 0.9 }}
                initial={false}
                transition={SILHOUETTE_TRANSITION}
              >
                <Silhouette size={168} strokeWidth={1.25} />
              </motion.span>
            )}
          </AnimatePresence>
        </Burst>
        {status === 'won' && (
          <motion.span {...MARK_POP} className={s.mark}>
            <AnimatedMarkOfExcellence marks={3} size={64} />
          </motion.span>
        )}
      </div>
      <figcaption className={s.caption}>
        <AnimatePresence mode='wait'>
          {isOver ? (
            <motion.span key='reveal' {...NAME_REVEAL} className={s.reveal}>
              <TankIdentity size='lg' tank={identity} />
            </motion.span>
          ) : (
            <motion.span key='hidden' className={s.redacted} exit={{ opacity: 0, y: -8 }}>
              {t('classified')}
            </motion.span>
          )}
        </AnimatePresence>
        <span className={s.hint}>{t(`status.${status}`)}</span>
      </figcaption>
    </figure>
  );
};
