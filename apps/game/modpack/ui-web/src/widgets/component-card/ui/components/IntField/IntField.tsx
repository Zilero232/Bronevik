import type { IntFieldProps } from './IntField.types';

import { useT } from '../../../../../entities/window-state';
import { Input } from '../../../../../shared/ui/input';
import { INT_FIELD } from '../../../config';
import { useIntField } from '../../../model/hooks';

import s from './IntField.module.scss';

export const IntField = ({ field, onSet }: IntFieldProps) => {
  const t = useT();
  const control = useIntField({ value: field.value, min: field.min, max: field.max, onCommit: (value) => onSet({ key: field.key, value }) });

  return (
    <div aria-label={field.label} className={s.stepper} role='group'>
      <button aria-label={t('decrease')} className={s.step} type='button' onClick={control.decrease}>
        {INT_FIELD.decreaseGlyph}
      </button>
      <Input
        aria-label={field.label}
        className={s.value}
        inputMode='numeric'
        value={control.text}
        onBlur={control.commit}
        onInput={(event) => control.edit(event.currentTarget.value)}
        onKeyDown={(event) => control.onKey(event.key)}
      />
      <button aria-label={t('increase')} className={s.step} type='button' onClick={control.increase}>
        {INT_FIELD.increaseGlyph}
      </button>
    </div>
  );
};
