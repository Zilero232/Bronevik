import type { CreateIconInput, IconComponent, IconProps } from './icon.types';

import { IconBase } from './IconBase';

export const createIcon = ({ name, children }: CreateIconInput): IconComponent => {
  const Icon = (props: IconProps) => (
    <IconBase name={name} {...props}>
      {children}
    </IconBase>
  );

  Icon.displayName = name;

  return Icon;
};
