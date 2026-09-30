import type { ReplayItem } from '../../../../../entities/replays';
import type { ReplaysBrowserModel } from '../../../model/hooks';

export type ReplayDetailsProps = {
  item: ReplayItem;
  browser: ReplaysBrowserModel;
};
