import type { ReactNode } from 'react';

type FaqItem = {
  id: string;
  question: ReactNode;
  answer: ReactNode;
};

export type FaqListProps = {
  items: readonly FaqItem[];
};
