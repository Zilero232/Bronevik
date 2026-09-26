'use client';

import { COMPARE } from '@bronevik/schemas';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Button, EmptyState, ErrorState } from '@/ui-kit';

import { useCompareBoard } from '../../../model/hooks';
import { BoardSkeleton } from '../BoardSkeleton';
import { ColumnHead } from '../ColumnHead';
import { ValueCell } from '../ValueCell';

import s from './CompareBoard.module.scss';

export const CompareBoard = () => {
  const t = useTranslations('tanks.compare.board');
  const { count, vehicles, sections, isLoading, isError, isFetching, onRetry, onClear, onRemove } = useCompareBoard();

  return match({ isLoading, isError, isEmpty: vehicles.length === 0 })
    .with({ isError: true }, () => <ErrorState isRetrying={isFetching} title={t('errorTitle')} onRetry={onRetry} />)
    .with({ isLoading: true }, () => <BoardSkeleton count={count} />)
    .with({ isEmpty: true }, () => (
      <EmptyState
        action={
          <Button size='sm' variant='secondary' onClick={onClear}>
            {t('clear')}
          </Button>
        }
        description={t('notFoundDescription')}
        title={t('notFoundTitle')}
      />
    ))
    .otherwise(() => (
      <section className={s.root}>
        {vehicles.length < COMPARE.minItems && <p className={s.hint}>{t('addMore')}</p>}
        {/* eslint-disable-next-line siberiacancode-jsx-a11y/no-noninteractive-tabindex -- a scrollable region must take focus so keyboard users can scroll it */}
        <div aria-label={t('label')} className={s.scroller} role='region' tabIndex={0}>
          <table className={s.table}>
            <thead>
              <tr>
                <th className={s.corner} scope='col'>
                  {t('count', { count: vehicles.length })}
                </th>
                {vehicles.map((vehicle) => (
                  <th key={vehicle.tankId} className={s.head} scope='col'>
                    <ColumnHead vehicle={vehicle} onRemove={() => onRemove(vehicle.tankId)} />
                  </th>
                ))}
              </tr>
            </thead>
            {sections.map((section) => (
              <tbody key={section.id}>
                <tr>
                  <th className={s.section} colSpan={vehicles.length + 1} scope='colgroup'>
                    {section.title}
                  </th>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.key} className={s.row}>
                    <th className={s.label} scope='row'>
                      {row.label}
                      {row.unit && <span className={s.unit}>{row.unit}</span>}
                    </th>
                    {vehicles.map((vehicle, index) => (
                      <td key={vehicle.tankId} className={s.cell}>
                        <ValueCell cell={row.cells.at(index)} isLoading={section.isLoading} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>
    ));
};
