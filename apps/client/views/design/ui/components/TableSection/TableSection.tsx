'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { DataTable, EmptyState, SegmentedControl } from '@/ui-kit';

import type { TableMode } from './TableSection.types';

import { TABLE_ROWS } from '../../../config';
import { useTankColumns } from '../../../model/hooks';
import { DesignBlock } from '../DesignBlock';

export const TableSection = () => {
  const t = useTranslations('design.table');
  const columns = useTankColumns();
  const [mode, setMode] = useState<TableMode>('small');

  const data = { small: [...TABLE_ROWS.small], large: [...TABLE_ROWS.large], loading: [], empty: [] }[mode];

  const switcher = (
    <SegmentedControl<TableMode>
      options={[
        { value: 'small', label: t('small') },
        { value: 'large', label: t('large') },
        { value: 'loading', label: t('loading') },
        { value: 'empty', label: t('empty') }
      ]}
      aria-label={t('mode')}
      size='sm'
      value={mode}
      onChange={setMode}
    />
  );

  return (
    <DesignBlock action={switcher} eyebrow='08' id='table' title={t('title')}>
      <DataTable
        key={mode}
        caption={t('caption', { count: data.length })}
        columns={columns}
        data={data}
        emptyState={<EmptyState description={t('emptyBody')} title={t('emptyTitle')} />}
        getRowId={(row) => String(row.id)}
        initialSorting={[{ id: 'winRate', desc: true }]}
        isLoading={mode === 'loading'}
      />
    </DesignBlock>
  );
};
