import type { ReplayItem } from '../../../../../entities/replays';

export type ReplayRowProps = {
  item: ReplayItem;
  top: number;
  height: number;
  selected: boolean;
  onSelect: (id: string) => void;
};
