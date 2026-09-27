import type { ComponentChildren } from 'preact';

export type ListItemMainProps = {
  title: string;
  badge?: ComponentChildren;
  children?: ComponentChildren;
};
