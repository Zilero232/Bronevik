import catalogFixture from '@contract/catalog.json';
import installationFixture from '@contract/installation.json';
import { describe, expect, it } from 'vitest';

import { catalogSchema } from '@/entities/catalog';
import { installationSchema } from '@/entities/installation';

import { COMPONENT_CATALOG } from '../../../config';
import { buildCatalogRows, filterCatalogRows } from '../catalog-rows';

const catalog = catalogSchema.parse(catalogFixture);
const installation = installationSchema.parse(installationFixture);
const rows = buildCatalogRows({ catalog, installation, locale: 'en' });

describe('buildCatalogRows', () => {
  it('takes each state from the installation and marks the rest as missing', () => {
    const states = new Map(installation.components.map((component) => [component.id, component.state]));

    expect(rows.every((row) => row.state === (states.get(row.id) ?? 'missing'))).toBe(true);
  });

  it('names dependencies by their titles', () => {
    const hitLog = rows.find((row) => row.id === 'hit_log');
    const damageLog = rows.find((row) => row.id === 'damage_log');

    expect(hitLog?.dependencies).toEqual([damageLog?.title]);
  });

  it('treats a missing installation as nothing installed', () => {
    expect(buildCatalogRows({ catalog, installation: null, locale: 'ru' }).every((row) => row.state === 'missing')).toBe(true);
  });
});

describe('filterCatalogRows', () => {
  it('keeps every row for all categories and an empty query', () => {
    expect(filterCatalogRows({ rows, category: COMPONENT_CATALOG.allCategories, query: '  ' })).toHaveLength(rows.length);
  });

  it('filters by category and by a case-insensitive query together', () => {
    const [first] = rows;
    const found = filterCatalogRows({ rows, category: first?.category ?? '', query: first?.title.toUpperCase() ?? '' });

    expect(found.map((row) => row.id)).toContain(first?.id);
    expect(found.every((row) => row.category === first?.category)).toBe(true);
  });
});
