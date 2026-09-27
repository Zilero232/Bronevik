import { toRoman } from '@otmetki/icons';

import type { ModuleOption, ModuleOptionsInput } from './module-options.types';

export const moduleOptions = ({ modules, labels }: ModuleOptionsInput): ModuleOption[] =>
  modules.map(({ id, tier }, index) => {
    if (index === modules.length - 1) {
      return { value: String(id), label: labels.top };
    }

    return { value: String(id), label: index === 0 ? labels.stock : toRoman(tier) };
  });
