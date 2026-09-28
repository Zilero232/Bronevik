import type { ReactNode } from 'react';

export type StoryCardTone = 'accent' | 'battle' | 'brass' | 'gold' | 'olive' | 'sky' | 'steel';

export type StoryCardVariant = 'default' | 'lead';

export type StoryCardProps = {
  title: ReactNode;
  href?: string;
  isExternal?: boolean;
  cover?: string | null;
  glyph?: ReactNode;
  tone?: StoryCardTone;
  chip?: ReactNode;
  flag?: ReactNode;
  meta?: ReactNode;
  excerpt?: ReactNode;
  footer?: ReactNode;
  actions?: ReactNode;
  variant?: StoryCardVariant;
  isPriority?: boolean;
  className?: string;
};
