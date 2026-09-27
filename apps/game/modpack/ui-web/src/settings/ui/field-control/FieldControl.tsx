import type { FieldProps } from '../field';

import { useT } from '../../model/hooks/use-t';
import { Input } from '../input';
import { IntField } from '../int-field';
import { Segmented } from '../segmented';
import { Toggle } from '../toggle';

export const FieldControl = ({ field, onSet }: FieldProps) => {
  const t = useT();

  if (field.type === 'bool') {
    return <Toggle label={field.label} on={field.value} onToggle={() => onSet({ key: field.key, value: !field.value })} />;
  }

  if (field.type === 'int') {
    return <IntField field={field} onSet={onSet} />;
  }

  if (field.type === 'choice') {
    return <Segmented wrap items={field.choices} value={field.value} onSelect={(value) => onSet({ key: field.key, value })} />;
  }

  return (
    <Input
      defaultValue={field.value}
      maxLength={field.max_length}
      placeholder={t('reset')}
      variant='wide'
      onChange={(event) => onSet({ key: field.key, value: event.currentTarget.value })}
    />
  );
};
