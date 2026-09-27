import { pickLocalized } from '@/shared/lib';

import type { BuildCatalogRowsInput, CatalogRow, FilterCatalogRowsInput } from './catalog-rows.types';

import { COMPONENT_CATALOG } from '../../config';

export const buildCatalogRows = ({ catalog, installation, locale }: BuildCatalogRowsInput): CatalogRow[] => {
  const states = new Map(installation?.components.map((component) => [component.id, component.state]));
  const titles = new Map(catalog.components.map((component) => [component.id, pickLocalized({ text: component.title, locale })]));

  return catalog.components.map((component) => ({
    id: component.id,
    category: component.category,
    title: titles.get(component.id) ?? component.id,
    description: pickLocalized({ text: component.description, locale }),
    fairPlay: pickLocalized({ text: component.fairPlay, locale }),
    required: component.required,
    state: states.get(component.id) ?? 'missing',
    dependencies: component.dependencies.map((id) => titles.get(id) ?? id),
    image: component.preview.image,
    video: component.preview.video
  }));
};

export const filterCatalogRows = ({ rows, category, query }: FilterCatalogRowsInput): CatalogRow[] => {
  const needle = query.trim().toLocaleLowerCase();

  return rows.filter(
    (row) =>
      (category === COMPONENT_CATALOG.allCategories || row.category === category) &&
      (needle === '' || `${row.title} ${row.description}`.toLocaleLowerCase().includes(needle))
  );
};
