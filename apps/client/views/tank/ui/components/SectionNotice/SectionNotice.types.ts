import type { ReactNode } from 'react';

export type SectionNoticeProps = {
  kind: 'empty' | 'error';
  title?: ReactNode;
  description?: ReactNode;
};
