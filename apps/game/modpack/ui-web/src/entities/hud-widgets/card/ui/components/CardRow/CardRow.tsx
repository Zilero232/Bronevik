import clsx from 'clsx';

import type { CardRowProps } from './CardRow.types';

import { barFill } from '../../../../../../shared/lib/hud-bar';
import { ClientIcon, toneClass } from '../../../../../../shared/ui/hud';
import { CARD } from '../../../config';

import s from './CardRow.module.scss';

export const CardRow = ({ row }: CardRowProps) => {
  const status = row.status === null ? null : CARD.status[row.status];
  const icon = status?.icon ?? row.icon;

  return (
    <div className={s.row}>
      <div className={s.line}>
        {icon !== null && <ClientIcon className={s.icon} icon={icon} size={CARD.rowIcon} tone={status?.tone ?? row.tone} />}
        {row.label !== null && <span className={s.label}>{row.label}</span>}
        {row.text !== null && <span className={clsx(s.text, toneClass(row.text_tone))}>{row.text}</span>}
        {row.value !== null && (
          <span className={clsx(s.value, toneClass(row.tone))} style={row.color === null ? undefined : { color: row.color }}>
            {row.value}
          </span>
        )}
        {row.note !== null && <span className={s.note}>{row.note}</span>}
      </div>
      {row.detail !== null && <span className={clsx(s.detail, icon !== null && s.indented)}>{row.detail}</span>}
      {row.progress !== null && (
        <div className={clsx(s.track, icon !== null && s.indented)}>
          <div className={clsx(s.fill, s[row.progress_tone])} style={{ width: `${String(barFill({ value: row.progress, max: 1, width: 100 }))}%` }} />
        </div>
      )}
    </div>
  );
};
