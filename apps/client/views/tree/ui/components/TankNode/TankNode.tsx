'use client';

import type { NodeProps } from '@xyflow/react';

import { TANK_CLASS_ICONS, toRoman } from '@bronevik/icons';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankImage, vehicleIdentity } from '@/entities/tank/tank';

import type { TankFlowNode } from '../../../lib/tree-flow';

import { NODE_ENTER, nodeTransition } from './TankNode.motion';

import s from './TankNode.module.scss';

const COMPACT = { notation: 'compact', maximumFractionDigits: 1 } as const;

export const TankNode = ({ data }: NodeProps<TankFlowNode>) => {
  const t = useTranslations('tree.node');
  const format = useFormatter();

  const { node, state, delay, onSelect } = data;
  const { vehicle, xp, credits } = node;
  const ClassIcon = TANK_CLASS_ICONS[vehicle.type];
  const name = vehicle.shortName || vehicle.name;
  const hasCost = xp !== null && xp > 0;

  return (
    <motion.div {...NODE_ENTER} className={s.root} data-premium={vehicle.isPremium} data-state={state} transition={nodeTransition(delay)}>
      <Handle className={s.handle} isConnectable={false} position={Position.Left} type='target' />
      <button
        aria-label={t('select', { name })}
        aria-pressed={state === 'selected'}
        className={s.body}
        type='button'
        onClick={() => onSelect(vehicle.tankId)}
      >
        <TankImage isDecorative className={s.render} size='small' tank={vehicleIdentity(vehicle)} withFallback={false} />
        <span className={s.icon}>
          <ClassIcon size={20} variant={vehicle.isPremium ? 'premium' : 'regular'} />
        </span>
        <span className={s.text}>
          <span className={s.name}>
            <span className={s.tier}>{toRoman(vehicle.tier)}</span>
            {name}
          </span>
          <span className={s.cost}>
            {hasCost ? (
              <>
                <span className={s.xp}>{t('xp', { value: format.number(xp, COMPACT) })}</span>
                {credits !== null && <span>{t('credits', { value: format.number(credits, COMPACT) })}</span>}
              </>
            ) : (
              <span>{t('root')}</span>
            )}
          </span>
        </span>
      </button>
      <Handle className={s.handle} isConnectable={false} position={Position.Right} type='source' />
    </motion.div>
  );
};
