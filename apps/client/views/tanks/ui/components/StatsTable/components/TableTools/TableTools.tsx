'use client';

import { Columns3, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Popover, ToggleChips } from '@/ui-kit';

import type { TableToolsProps } from './TableTools.types';

import { TANKS_TABLE } from '../../../../../config';

import s from './TableTools.module.scss';

export const TableTools = ({ visible, onVisibleChange, onExport }: TableToolsProps) => {
  const t = useTranslations('tanks.table');

  return (
    <div className={s.root}>
      <Popover
        trigger={
          <Button size='sm' variant='secondary'>
            <Columns3 aria-hidden size={14} />
            {t('columnsPicker')}
          </Button>
        }
        align='end'
        title={t('columnsPicker')}
      >
        <ToggleChips
          aria-label={t('columnsPicker')}
          className={s.chips}
          options={TANKS_TABLE.optionalColumns.map((value) => ({ value, label: t(TANKS_TABLE.columnLabels[value]) }))}
          size='sm'
          value={visible}
          onChange={onVisibleChange}
        />
      </Popover>
      <Button size='sm' variant='secondary' onClick={onExport}>
        <Download aria-hidden size={14} />
        {t('exportCsv')}
      </Button>
    </div>
  );
};
