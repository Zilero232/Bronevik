'use client';

import { toRoman } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import type { BuildModule } from '../../../lib/build-catalog';

import { MODULE_ICONS, PANEL_ICONS } from '../../../config';
import { MODULE_SLOTS, selectedModules, setModule, slotModules } from '../../../lib/loadout-edit';
import { useBuildContext } from '../../../model/context';
import { PanelCard } from '../PanelCard';

import s from './ModulesPanel.module.scss';

export const ModulesPanel = () => {
  const t = useTranslations('builds.panels.modules');
  const { catalog, active, edit } = useBuildContext();

  const { modules: all } = catalog;
  const selection = selectedModules({ loadout: active, modules: all });
  const slots = MODULE_SLOTS.map((slot) => ({ slot, modules: slotModules({ modules: all, slot, selection }) })).filter(
    ({ modules }) => modules.length > 0
  );

  const optionsOf = (modules: readonly BuildModule[]) =>
    modules.map(({ id, tier }, index) => {
      const lower = index === 0 ? t('stock') : toRoman(tier);

      return { value: String(id), label: index === modules.length - 1 ? t('top') : lower };
    });

  const onSelect = (slot: BuildModule['slot']) => (moduleId: string) =>
    edit((loadout) => setModule({ loadout, modules: all, slot, moduleId: Number(moduleId) }));

  return (
    <PanelCard description={t('description')} icon={PANEL_ICONS.modules} index='// 03' title={t('title')}>
      <ul className={s.list}>
        {slots.map(({ slot, modules }) => {
          const Icon = MODULE_ICONS[slot];
          const current = modules.find(({ id }) => id === selection[slot]);

          return (
            <li key={slot} className={s.row} data-top={current === modules.at(-1)}>
              <span aria-hidden className={s.icon}>
                <Icon size={16} strokeWidth={1.75} />
              </span>
              <span className={s.text}>
                <span className={s.slot}>{t(`slots.${slot}`)}</span>
                <span className={s.name}>{current?.name}</span>
              </span>
              <SegmentedControl
                aria-label={t(`slots.${slot}`)}
                options={optionsOf(modules)}
                size='sm'
                value={String(selection[slot])}
                onChange={onSelect(slot)}
              />
            </li>
          );
        })}
      </ul>
    </PanelCard>
  );
};
