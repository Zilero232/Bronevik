import type { ComponentChildren } from 'preact';

export type BrowserStatusProps = {
  title?: string;
  text: string;
  progress?: number | null;
  children?: ComponentChildren;
};
