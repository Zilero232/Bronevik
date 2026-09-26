'use client';

import { useTranslations } from 'next-intl';

import type { BuildModuleSlot } from '../../../lib/build-catalog';

import { MODULE_SLOTS, selectedModules, setModule, slotModules } from '../../../lib/loadout-edit';
import { moduleOptions } from '../../../lib/module-options';
import { useBuildContext } from '../../context';

export const useModulesPanel = () => {
  const t = useTranslations('builds.panels.modules');
  const { catalog, active, edit } = useBuildContext();

  const { modules: all } = catalog;
  const selection = selectedModules({ loadout: active, modules: all });
  const labels = { stock: t('stock'), top: t('top') };

  const slots = MODULE_SLOTS.map((slot) => ({ slot, modules: slotModules({ modules: all, slot, selection }) }))
    .filter(({ modules }) => modules.length > 0)
    .map(({ slot, modules }) => {
      const current = modules.find(({ id }) => id === selection[slot]);

      return {
        slot,
        name: current?.name ?? '',
        value: String(selection[slot]),
        isTop: current === modules.at(-1),
        options: moduleOptions({ modules, labels })
      };
    });

  const onSelect = (slot: BuildModuleSlot) => (moduleId: string) =>
    edit((loadout) => setModule({ loadout, modules: all, slot, moduleId: Number(moduleId) }));

  return { slots, onSelect };
};
