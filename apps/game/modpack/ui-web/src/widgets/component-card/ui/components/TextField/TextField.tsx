import type { TextFieldProps } from './TextField.types';

import { Input } from '../../../../../shared/ui/input';
import { useTextField } from '../../../model/hooks';

export const TextField = ({ field, onSet }: TextFieldProps) => {
  const control = useTextField({ value: field.value, onCommit: (value) => onSet({ key: field.key, value }) });

  return (
    <Input
      aria-label={field.label}
      maxLength={field.max_length}
      placeholder={field.default}
      value={control.text}
      variant='wide'
      onBlur={control.commit}
      onInput={(event) => control.edit(event.currentTarget.value)}
      onKeyDown={(event) => control.onKey(event.key)}
    />
  );
};
