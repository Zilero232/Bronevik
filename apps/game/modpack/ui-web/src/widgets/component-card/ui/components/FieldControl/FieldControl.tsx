import type { FieldProps } from '../Field';

import { Segmented } from '../../../../../shared/ui/segmented';
import { Toggle } from '../../../../../shared/ui/toggle';
import { choiceLayout } from '../../../lib/choice-layout';
import { ChoiceGallery } from '../ChoiceGallery';
import { ChoiceList } from '../ChoiceList';
import { IntField } from '../IntField';
import { TextField } from '../TextField';

export const FieldControl = ({ field, gallery, onSet }: FieldProps) => {
  if (field.type === 'bool') {
    return <Toggle label={field.label} on={field.value} onToggle={() => onSet({ key: field.key, value: !field.value })} />;
  }

  if (field.type === 'int') {
    return <IntField field={field} onSet={onSet} />;
  }

  if (field.type === 'choice' && gallery) {
    return <ChoiceGallery field={field} icons={gallery} onSelect={(value) => onSet({ key: field.key, value })} />;
  }

  if (field.type === 'choice' && choiceLayout(field.choices) === 'list') {
    return <ChoiceList field={field} onSelect={(value) => onSet({ key: field.key, value })} />;
  }

  if (field.type === 'choice') {
    return <Segmented items={field.choices} label={field.label} value={field.value} onSelect={(value) => onSet({ key: field.key, value })} />;
  }

  if (field.type === 'text') {
    return <TextField field={field} onSet={onSet} />;
  }

  return field satisfies never;
};
