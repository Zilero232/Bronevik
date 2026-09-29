import type { Key, ReactNode } from 'react';

export type ObtainListRow = {
  key: Key;
  label: ReactNode;
  value: ReactNode;
};

export type ObtainListProps = {
  title: ReactNode;
  rows: readonly ObtainListRow[];
};
