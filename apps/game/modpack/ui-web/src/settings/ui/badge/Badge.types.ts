import type { ComponentChildren } from 'preact';

export type BadgeTone = 'default' | 'gold';

export type BadgeProps = {
  tone?: BadgeTone;
  children: ComponentChildren;
};
