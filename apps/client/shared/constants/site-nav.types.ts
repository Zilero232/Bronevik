import type { ComponentType } from 'react';

export type SiteNavIconProps = {
  size?: number | string;
  strokeWidth?: number | string;
  className?: string;
};

export type SiteNavIcon = ComponentType<SiteNavIconProps>;
