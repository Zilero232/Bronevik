import type { FieldProps } from './Field.types';

import { FieldControl } from '../field-control';

export const Field = ({ field, onSet }: FieldProps) => (
  <div className='field'>
    <div className='field__text'>
      <span className='field__label'>{field.label}</span>
      {field.hint && <span className='field__hint'>{field.hint}</span>}
    </div>
    <FieldControl field={field} onSet={onSet} />
  </div>
);
