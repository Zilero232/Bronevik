import clsx from 'clsx';

import type { FieldProps } from './Field.types';

import { useT } from '../../model/hooks/use-t/use-t';
import { Toggle } from '../toggle/Toggle';
import { IntField } from './IntField';

const Control = ({ field, onSet }: FieldProps) => {
  const t = useT();

  if (field.type === 'bool') {
    return <Toggle label={field.label} on={field.value} onToggle={() => onSet({ key: field.key, value: !field.value })} />;
  }

  if (field.type === 'int') {
    return <IntField field={field} onSet={onSet} />;
  }

  if (field.type === 'choice') {
    return (
      <div className='segmented segmented--wrap'>
        {field.choices.map((choice) => (
          <button
            key={choice.value}
            className={clsx('segmented__item', choice.value === field.value && 'segmented__item--on')}
            type='button'
            onClick={() => onSet({ key: field.key, value: choice.value })}
          >
            {choice.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <input
      className='input input--wide'
      defaultValue={field.value}
      maxLength={field.max_length}
      placeholder={t('reset')}
      onChange={(event) => onSet({ key: field.key, value: event.currentTarget.value })}
    />
  );
};

export const Field = ({ field, onSet }: FieldProps) => (
  <div className='field'>
    <div className='field__text'>
      <span className='field__label'>{field.label}</span>
      {field.hint && <span className='field__hint'>{field.hint}</span>}
    </div>
    <Control field={field} onSet={onSet} />
  </div>
);
