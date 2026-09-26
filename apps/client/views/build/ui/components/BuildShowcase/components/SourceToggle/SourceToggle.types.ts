import type { BuildUsage } from '@otmetki/schemas';

import type { BuildShowcaseSource } from '../../../../../model/hooks';

export type SourceToggleProps = {
  source: BuildShowcaseSource;
  isPlus: boolean;
  usage: BuildUsage | null;
  onChange: (source: BuildShowcaseSource) => void;
};
