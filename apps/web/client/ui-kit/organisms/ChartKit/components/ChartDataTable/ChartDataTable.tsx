import { useTranslations } from 'next-intl';

import type { ChartDataTableProps } from '../../ChartKit.types';

import s from '../../ChartKit.module.scss';

export const ChartDataTable = ({ id, caption, labels, series, formatValue, isVisible }: ChartDataTableProps) => {
  const t = useTranslations('common.chart');

  return (
    <div className={s.tableWrap} data-visible={isVisible} id={id}>
      <table className={s.table}>
        {caption && <caption className={s.tableCaption}>{caption}</caption>}
        <thead>
          <tr>
            <th scope='col'>{t('point')}</th>
            {series.map((item) => (
              <th key={item.id} scope='col'>
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => (
            <tr key={label}>
              <th scope='row'>{label}</th>
              {series.map((item) => (
                <td key={item.id}>{item.values[index] === undefined ? '—' : formatValue(item.values[index])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
