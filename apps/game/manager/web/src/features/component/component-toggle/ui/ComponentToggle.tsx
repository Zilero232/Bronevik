import { Switch } from '@/ui-kit';

import type { ComponentToggleProps } from './ComponentToggle.types';

import { useComponentToggle } from '../model/hooks';

export const ComponentToggle = ({ clientPath, componentId, title, libraries, checked, disabled, isLocked = false }: ComponentToggleProps) => {
  const { isPending, onCheckedChange } = useComponentToggle({ clientPath, componentId, title, libraries });

  return (
    <Switch
      hideLabel
      checked={checked}
      disabled={disabled}
      isLocked={isLocked}
      isPending={isPending}
      label={title}
      onCheckedChange={onCheckedChange}
    />
  );
};
