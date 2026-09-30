import { useStore } from '@nanostores/react';

import type { UseSectionCardsInput } from './use-section-cards.types';

import { $components, componentsOf } from '../../../../../entities/window-state';
import { splitColumns } from '../../../lib/columns';

export const useSectionCards = ({ section, columns }: UseSectionCardsInput) => {
  const components = useStore($components);
  const shown = componentsOf({ components, section, context: 'all' });

  return {
    empty: shown.length === 0,
    columns: splitColumns({ items: shown.map((component) => ({ component })), columns })
  };
};
