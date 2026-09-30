import type { InlineFormProps } from './InlineForm.types';

import { Button } from '../../../../../shared/ui/button';
import { Input } from '../../../../../shared/ui/input';

import s from './InlineForm.module.scss';

export const InlineForm = ({ value, label, placeholder, submitLabel, maxLength, accent = false, onValue, onKey, onSubmit }: InlineFormProps) => (
  <div className={s.form}>
    <Input
      aria-label={label}
      className={s.input}
      maxLength={maxLength}
      placeholder={placeholder}
      value={value}
      variant='wide'
      onChange={(event) => onValue(event.currentTarget.value)}
      onKeyDown={(event) => onKey(event.key)}
    />
    <Button variant={accent ? 'accent' : 'default'} onClick={onSubmit}>
      {submitLabel}
    </Button>
  </div>
);
