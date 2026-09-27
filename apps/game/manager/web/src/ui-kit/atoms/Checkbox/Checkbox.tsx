import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Check } from 'lucide-react';
import { useId } from 'react';

import type { CheckboxProps } from './Checkbox.types';

import s from './Checkbox.module.scss';

export const Checkbox = ({ checked, label, description, disabled = false, onCheckedChange }: CheckboxProps) => {
  const id = useId();

  return (
    <div className={s.root}>
      <BaseCheckbox.Root checked={checked} className={s.box} disabled={disabled} id={id} onCheckedChange={onCheckedChange}>
        <BaseCheckbox.Indicator className={s.indicator}>
          <Check aria-hidden />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <label className={s.text} htmlFor={id}>
        <span className={s.label}>{label}</span>
        {description && <span className={s.description}>{description}</span>}
      </label>
    </div>
  );
};
