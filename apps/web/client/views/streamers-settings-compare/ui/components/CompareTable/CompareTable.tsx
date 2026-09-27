'use client';

import { SettingsValue, useSettingsFormatter } from '@/entities/streamer/settings';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card } from '@/ui-kit';

import type { CompareTableProps } from './CompareTable.types';

import s from './CompareTable.module.scss';

export const CompareTable = ({ columns, sections }: CompareTableProps) => {
  const { groupLabel, fieldLabel } = useSettingsFormatter();

  return (
    <Card className={s.scroll} padding='none' variant='panel'>
      <table className={s.table}>
        <thead>
          <tr>
            <th aria-hidden className={s.head} />
            {columns.map((column) => (
              <th key={column.id} className={s.head} scope='col'>
                {column.slug ? (
                  <Link className={s.headLink} href={ROUTES.streamers.settings.profile(column.slug)}>
                    {column.label}
                  </Link>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        {sections.map((section) => (
          <tbody key={section.group}>
            <tr>
              <th className={s.section} colSpan={columns.length + 1} scope='colgroup'>
                {groupLabel(section.group)}
              </th>
            </tr>
            {section.rows.map((row) => (
              <tr key={row.field} className={s.row} data-differs={row.differs}>
                <th className={s.label} scope='row'>
                  {fieldLabel(row.field)}
                </th>
                {columns.map((column, index) => (
                  <td key={column.id} className={s.cell}>
                    <SettingsValue row={{ path: row.field, value: row.values[index] ?? null }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </Card>
  );
};
