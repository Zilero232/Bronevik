import type { IntFieldProps } from './IntField.types';

import { useIntField } from '../../model/hooks/use-int-field';

export const IntField = ({ field, onSet }: IntFieldProps) => {
  const control = useIntField({ value: field.value, min: field.min, max: field.max, onCommit: (value) => onSet({ key: field.key, value }) });

  return (
    <div className='stepper'>
      <button className='stepper__button' type='button' onClick={() => control.step(-1)}>
        −
      </button>
      <input
        className='input stepper__input'
        value={control.text}
        onBlur={control.commit}
        onInput={(event) => control.edit(event.currentTarget.value)}
        onKeyDown={(event) => event.key === 'Enter' && control.commit()}
      />
      <button className='stepper__button' type='button' onClick={() => control.step(1)}>
        +
      </button>
    </div>
  );
};
