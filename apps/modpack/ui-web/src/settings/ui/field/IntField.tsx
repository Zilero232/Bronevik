import type { UiField } from '../../model/protocol/protocol.types';
import type { FieldProps } from './Field.types';

import { useIntField } from '../../model/hooks/use-int-field/use-int-field';

export const IntField = ({ field, onSet }: FieldProps<Extract<UiField, { type: 'int' }>>) => {
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
