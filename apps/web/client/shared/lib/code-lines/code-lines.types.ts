import type { CSSProperties } from 'react';
import type { GeneratedLine } from 'sugar-high/core';

type CodeToken = {
  key: number;
  className: string;
  style: CSSProperties;
  value: string;
};

export type CodeLine = {
  key: number;
  isFirst: boolean;
  className: GeneratedLine['properties']['className'];
  tokens: CodeToken[];
};
