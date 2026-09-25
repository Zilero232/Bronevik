import type { SearchGroups } from '../../../lib/group-results';

export type PaletteResultsProps = {
  results: SearchGroups;
  onSelect: (href: string) => void;
};
