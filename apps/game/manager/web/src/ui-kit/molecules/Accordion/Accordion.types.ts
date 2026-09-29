import type { ReactNode } from 'react';

export type AccordionItem = {
  id: string;
  title: ReactNode;
  content: ReactNode;
};

export type AccordionProps = {
  items: readonly AccordionItem[];
};
