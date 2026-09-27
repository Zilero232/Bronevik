import type { ComponentChildren } from 'preact';

export type RowListProps = {
  children: ComponentChildren;
};

export type RowProps = {
  active?: boolean;
  children: ComponentChildren;
};

export type RowMainProps = {
  title: string;
  badge?: ComponentChildren;
  children?: ComponentChildren;
};

export type RowSlotProps = {
  children: ComponentChildren;
};
