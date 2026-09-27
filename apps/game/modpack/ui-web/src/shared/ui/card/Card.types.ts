import type { ComponentChildren } from 'preact';

export type CardProps = {
  title: string;
  hint?: string | null;
  aside?: ComponentChildren;
  children?: ComponentChildren;
};
