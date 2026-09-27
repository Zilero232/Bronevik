import type { FieldProps } from './Field.types';

import { FieldControl } from '../FieldControl';

import s from './Field.module.scss';

export const Field = ({ field, onSet }: FieldProps) => (
  <div className={s.field}>
    <div className={s.text}>
      <span className={s.label}>{field.label}</span>
      {field.hint && <span className={s.hint}>{field.hint}</span>}
    </div>
    <FieldControl field={field} onSet={onSet} />
  </div>
);
