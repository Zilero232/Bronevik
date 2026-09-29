import type { ReactNode } from 'react';

export type FaqItem = {
  id: string;
  question: ReactNode;
  answer: ReactNode;
};

export type FaqListProps = {
  items: readonly FaqItem[];
};
