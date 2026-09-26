'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, DataTable, EmptyState, SegmentedControl } from '@/ui-kit';

import type { BreakdownDimension } from '../../../model/hooks';
import type { BreakdownPanelProps } from './BreakdownPanel.types';

import { useBreakdownPanel } from '../../../model/hooks';

export const BreakdownPanel = ({ breakdown }: BreakdownPanelProps) => {
  const t = useTranslations('analytics.overview.breakdown');
  const { dimension, options, rows, columns, setDimension } = useBreakdownPanel(breakdown);

  return (
    <Card padding='none'>
      <CardHeader
        tabs={<SegmentedControl<BreakdownDimension> aria-label={t('title')} options={options} size='sm' value={dimension} onChange={setDimension} />}
        title={t('title')}
      />
      <DataTable
        caption={t('title')}
        columns={columns}
        data={rows}
        density='compact'
        emptyState={<EmptyState isCompact title={t('empty')} />}
        getRowId={(row) => row.key}
        initialSorting={[{ id: 'battles', desc: true }]}
      />
    </Card>
  );
};
