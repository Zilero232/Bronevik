import type { FieldProps } from '../Field';

import { useT } from '../../../../../entities/window-state';
import { Input } from '../../../../../shared/ui/input';
import { Segmented } from '../../../../../shared/ui/segmented';
import { Toggle } from '../../../../../shared/ui/toggle';
import { IntField } from '../IntField';

export const FieldControl = ({ field, onSet }: FieldProps) => {
  const t = useT();

  if (field.type === 'bool') {
    return <Toggle label={field.label} on={field.value} onToggle={() => onSet({ key: field.key, value: !field.value })} />;
  }

  if (field.type === 'int') {
    return <IntField field={field} onSet={onSet} />;
  }

  if (field.type === 'choice') {
    return <Segmented wrap items={field.choices} label={field.label} value={field.value} onSelect={(value) => onSet({ key: field.key, value })} />;
  }

  return (
    <Input
      aria-label={field.label}
      defaultValue={field.value}
      maxLength={field.max_length}
      placeholder={t('reset')}
      variant='wide'
      onChange={(event) => onSet({ key: field.key, value: event.currentTarget.value })}
    />
  );
};
