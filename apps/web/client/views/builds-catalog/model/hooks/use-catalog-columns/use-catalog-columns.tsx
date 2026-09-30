'use client';

import type { BuildsCatalogEntry } from '@otmetki/schemas';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { TankCell, WinRateCell } from '@/entities/tank/tank';

import { CATALOG_TABLE } from '../../../config';
import { CoverageCell, PicksCell } from '../../../ui/components/CatalogTable/components';

const column = createColumnHelper<BuildsCatalogEntry>();

export const useCatalogColumns = (): TableColumn<BuildsCatalogEntry>[] => {
  const t = useTranslations('buildsCatalog.table');
  const format = useFormatter();

  return [
    column.accessor((row) => row.vehicle.name, {
      id: 'tank',
      header: t('tank'),
      cell: (info) => <TankCell vehicle={info.row.original.vehicle} />,
      meta: { width: CATALOG_TABLE.tankWidth, isSticky: true }
    }),
    column.accessor('battles', {
      header: t('coverage'),
      cell: (info) => <CoverageCell battles={info.getValue()} isEnough={info.row.original.isEnough} players={info.row.original.players} />,
      meta: CATALOG_TABLE.numeric
    }),
    column.accessor('winRate', { header: t('winRate'), cell: (info) => <WinRateCell value={info.getValue()} />, meta: CATALOG_TABLE.numeric }),
    column.accessor('avgDamage', {
      header: t('avgDamage'),
      cell: (info) => {
        const value = info.getValue();

        return value === null ? '—' : format.number(value, { maximumFractionDigits: 0 });
      },
      meta: { ...CATALOG_TABLE.numeric, hideBelow: 'md' }
    }),
    column.accessor('topEquipment', { header: t('equipment'), enableSorting: false, cell: (info) => <PicksCell picks={info.getValue()} /> }),
    column.accessor('topConsumables', {
      header: t('consumables'),
      enableSorting: false,
      cell: (info) => <PicksCell picks={info.getValue()} />,
      meta: { hideBelow: 'lg' }
    })
  ];
};
