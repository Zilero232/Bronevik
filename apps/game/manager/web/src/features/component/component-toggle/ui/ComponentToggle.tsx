import { Switch } from '@/ui-kit';

import type { ComponentToggleProps } from './ComponentToggle.types';

import { useComponentToggle } from '../model/hooks';

export const ComponentToggle = ({ clientPath, componentId, title, checked, disabled }: ComponentToggleProps) => {
  const { isPending, onCheckedChange } = useComponentToggle({ clientPath, componentId, title });

  return <Switch hideLabel checked={checked} disabled={disabled} isPending={isPending} label={title} onCheckedChange={onCheckedChange} />;
};
