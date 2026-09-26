'use client';

import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import { useModulesPanel } from '../../../model/hooks';
import { PanelCard } from '../PanelCard';

import s from './ModulesPanel.module.scss';

export const ModulesPanel = () => {
  const t = useTranslations('builds.panels.modules');
  const { slots, onSelect } = useModulesPanel();

  return (
    <PanelCard description={t('description')} title={t('title')}>
      <ul className={s.list}>
        {slots.map(({ slot, name, value, isTop, options }) => (
          <li key={slot} className={s.row} data-top={isTop}>
            <span className={s.text}>
              <span className={s.slot}>{t(`slots.${slot}`)}</span>
              <span className={s.name}>{name}</span>
            </span>
            <SegmentedControl aria-label={t(`slots.${slot}`)} options={options} size='sm' value={value} onChange={onSelect(slot)} />
          </li>
        ))}
      </ul>
    </PanelCard>
  );
};
