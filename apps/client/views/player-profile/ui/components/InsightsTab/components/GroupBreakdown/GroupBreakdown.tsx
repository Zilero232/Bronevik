'use client';

import { TANK_CLASS_ICONS, toRoman } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { signed } from '@/entities/player/stats';
import { percentText } from '@/shared/lib';

import type { GroupBreakdownProps } from './GroupBreakdown.types';

import { GROUP_BREAKDOWN } from '../../../../../config';
import { groupKeyOf } from '../../../../../lib/group-key';

import s from './GroupBreakdown.module.scss';

export const GroupBreakdown = ({ kind, groups }: GroupBreakdownProps) => {
  const t = useTranslations('profile.insights');
  const tGame = useTranslations('game.classes');
  const format = useFormatter();

  return (
    <section className={s.root}>
      <h4 className={s.heading}>{t(kind === 'class' ? 'byClass' : 'byTier')}</h4>
      <ul className={s.list}>
        {groups.map(({ key, battles, winRate, winRateDelta }) => {
          const delta = winRateDelta ?? 0;
          const side = delta >= 0 ? 'up' : 'down';
          const group = groupKeyOf(key);
          const Icon = group.kind === 'class' ? TANK_CLASS_ICONS[group.type] : null;

          return (
            <li key={key} className={s.row}>
              <span className={s.label}>
                {Icon && <Icon size={16} />}
                {match(group)
                  .with({ kind: 'class' }, ({ type }) => tGame(type))
                  .with({ kind: 'tier' }, ({ tier }) => t('tierLabel', { tier: toRoman(tier) }))
                  .with({ kind: 'raw' }, ({ key: raw }) => raw)
                  .exhaustive()}
              </span>
              <span aria-hidden className={s.bar}>
                <span className={s.fill} data-side={side} style={{ '--fill': `${Math.min(Math.abs(delta) / GROUP_BREAKDOWN.scalePp, 1) * 50}%` }} />
              </span>
              <span className={s.value} data-side={side}>
                {signed({ value: delta, digits: 1 })}
              </span>
              <span className={s.meta}>
                {percentText({ format, value: winRate })} · {t('battles', { count: battles })}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
