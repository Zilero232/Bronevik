import { Fragment } from 'react';

import type { TankColumnProps } from './TankColumn.types';

import { ColumnHead } from '../ColumnHead';
import { ValueCell } from '../ValueCell';

import s from './TankColumn.module.scss';

export const TankColumn = ({ vehicle, index, sections }: TankColumnProps) => (
  <>
    <ColumnHead index={index} vehicle={vehicle} />
    {sections.map((section) => (
      <Fragment key={section.id}>
        <div aria-hidden className={s.section} />
        {section.rows.map((row) => (
          <ValueCell key={row.key} cell={row.cells.at(index)} isLoading={section.isLoading} label={row.label} unit={row.unit} />
        ))}
      </Fragment>
    ))}
  </>
);
