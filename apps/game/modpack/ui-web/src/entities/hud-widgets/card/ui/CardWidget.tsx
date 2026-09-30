import clsx from 'clsx';

import type { CardWidgetProps } from './CardWidget.types';

import { ClientIcon, HudPlate, toneClass } from '../../../../shared/ui/hud';
import { CARD } from '../config';
import { CardChips, CardRow } from './components';

import s from './CardWidget.module.scss';

export const CardWidget = ({ data }: CardWidgetProps) => {
  const hasBody = data.rows.length > 0 || data.chips.length > 0 || data.footer !== null;

  return (
    <HudPlate className={s.plate} rail={data.rail}>
      <div className={s.box} style={data.width === null ? undefined : { width: `${data.width}rem` }}>
        {(data.title !== null || data.value !== null) && (
          <div className={clsx(s.header, hasBody && s.divided)}>
            {data.icon !== null && <ClientIcon className={s.icon} icon={data.icon} size={CARD.headerIcon} tone='accent' />}
            {data.title !== null && <span className={s.title}>{data.title}</span>}
            {data.subtitle !== null && <span className={s.subtitle}>{data.subtitle}</span>}
            {data.value !== null && <span className={clsx(s.value, toneClass(data.value_tone))}>{data.value}</span>}
          </div>
        )}
        {data.chips.length > 0 && <CardChips chips={data.chips} />}
        {data.rows.map((row, index) => (
          <CardRow key={`${String(index)}-${row.text ?? row.label ?? ''}`} row={row} />
        ))}
        {data.footer !== null && <span className={s.footer}>{data.footer}</span>}
      </div>
    </HudPlate>
  );
};
