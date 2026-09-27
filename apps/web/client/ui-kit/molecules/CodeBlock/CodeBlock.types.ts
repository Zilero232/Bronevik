import type { ReactNode } from 'react';

export type CodeBlockProps = {
  code: string;
  language: string;
  title?: ReactNode;
  className?: string;
};
