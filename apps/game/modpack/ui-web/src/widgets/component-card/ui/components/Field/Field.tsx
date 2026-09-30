import clsx from 'clsx';

import type { FieldProps } from './Field.types';

import { isChanged } from '../../../../../entities/window-state';
import { FieldControl } from '../FieldControl';

import s from './Field.module.scss';

export const Field = ({ field, onSet }: FieldProps) => (
  <div className={s.field}>
    <div className={s.text}>
      <span className={s.labelRow}>
        <span className={clsx(s.dot, isChanged(field) && s.dotOn)} />
        <span className={s.label}>{field.label}</span>
      </span>
      {field.hint && <span className={s.hint}>{field.hint}</span>}
    </div>
    <div className={s.control}>
      <FieldControl field={field} onSet={onSet} />
    </div>
  </div>
);
