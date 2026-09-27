import type { DeepLink } from '../../../api';

export type UseDeepLinksInput = {
  onLink: (link: DeepLink) => void;
};
