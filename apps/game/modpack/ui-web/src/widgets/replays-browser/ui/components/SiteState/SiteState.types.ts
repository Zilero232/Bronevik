import type { ReplayItem } from '../../../../../entities/replays';

export type SiteStateProps = {
  state: NonNullable<ReplayItem['site']>['state'];
  size: 'details' | 'row';
};
