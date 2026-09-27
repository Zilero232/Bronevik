import type { IntFieldProps } from './IntField.types';

import { useIntField } from '../../model/hooks/use-int-field';
import { Input } from '../input';

import s from './IntField.module.scss';

export const IntField = ({ field, onSet }: IntFieldProps) => {
  const control = useIntField({ value: field.value, min: field.min, max: field.max, onCommit: (value) => onSet({ key: field.key, value }) });

  return (
    <div className={s.stepper}>
      <button className={s.step} type='button' onClick={() => control.step(-1)}>
        −
      </button>
      <Input
        className={s.value}
        value={control.text}
        onBlur={control.commit}
        onInput={(event) => control.edit(event.currentTarget.value)}
        onKeyDown={(event) => event.key === 'Enter' && control.commit()}
      />
      <button className={s.step} type='button' onClick={() => control.step(1)}>
        +
      </button>
    </div>
  );
};
