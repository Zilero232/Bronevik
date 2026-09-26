'use client';

import type { NodeProps } from '@xyflow/react';

import { TANK_CLASS_ICONS, toRoman } from '@otmetki/icons';
import { Handle, Position } from '@xyflow/react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankImage, vehicleIdentity } from '@/entities/tank/tank';

import type { TankFlowNode } from '../../../lib/tree-flow';

import { TREE_FORMAT } from '../../../config';

import s from './TankNode.module.scss';

export const TankNode = ({ data }: NodeProps<TankFlowNode>) => {
  const t = useTranslations('tree.node');
  const format = useFormatter();

  const { node, state, onSelect } = data;
  const { vehicle, xp } = node;
  const ClassIcon = TANK_CLASS_ICONS[vehicle.type];
  const name = vehicle.shortName || vehicle.name;

  return (
    <div className={s.root} data-premium={vehicle.isPremium} data-state={state}>
      <Handle className={s.handle} isConnectable={false} position={Position.Left} type='target' />
      <button
        aria-label={t('select', { name })}
        aria-pressed={state === 'selected'}
        className={s.body}
        type='button'
        onClick={() => onSelect(vehicle.tankId)}
      >
        <span className={s.head}>
          <ClassIcon aria-hidden className={s.icon} size={14} variant={vehicle.isPremium ? 'premium' : 'regular'} />
          <span className={s.tier}>{toRoman(vehicle.tier)}</span>
          <span className={s.name}>{name}</span>
        </span>
        <span className={s.foot}>
          <TankImage isDecorative className={s.render} size='small' tank={vehicleIdentity(vehicle)} withFallback={false} />
          <span className={s.cost}>{xp !== null && xp > 0 ? t('xp', { value: format.number(xp, TREE_FORMAT.compact) }) : t('root')}</span>
        </span>
      </button>
      <Handle className={s.handle} isConnectable={false} position={Position.Right} type='source' />
    </div>
  );
};
