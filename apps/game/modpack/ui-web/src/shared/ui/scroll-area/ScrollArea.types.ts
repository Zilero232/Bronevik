import type { ComponentChildren } from 'preact';

export type ScrollAreaProps = {
  className?: string;
  contentClassName?: string;
  label?: string;
  initialTop?: number;
  onScrollEnd?: (top: number) => void;
  children: ComponentChildren;
};
