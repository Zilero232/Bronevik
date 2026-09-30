import type { RefObject } from 'preact';

export type BrandProps = {
  compact: boolean;
  dragRef: RefObject<HTMLDivElement>;
  onRecentre: () => void;
};
