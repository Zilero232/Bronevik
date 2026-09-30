import type { CardWidgetProps } from './CardWidget.types';

import { HudPlate, HudText } from '../../../../shared/ui/hud';
import { CardChips, CardHeader, CardRow, CardStrip } from './components';

import s from './CardWidget.module.scss';

export const CardWidget = ({ data }: CardWidgetProps) => (
  <HudPlate className={s.plate} rail={data.rail}>
    <div className={s.box} style={data.width === null ? undefined : { width: `${data.width}rem` }}>
      <CardHeader data={data} />
      {data.chips.length > 0 && <CardChips chips={data.chips} />}
      {data.strip.length > 0 && <CardStrip marks={data.strip} />}
      {data.rows.map((row, index) => (
        <CardRow key={`${String(index)}-${row.text ?? row.label ?? ''}`} row={row} />
      ))}
      <HudText className={s.footer} text={data.footer} />
    </div>
  </HudPlate>
);
