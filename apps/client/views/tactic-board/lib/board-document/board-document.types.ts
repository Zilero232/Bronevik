import type * as Y from 'yjs';

import type { TacticLayer } from '@/shared/api/tactics';

export type WriteLayerInput = {
  doc: Y.Doc;
  layer: TacticLayer;
};

export type DeleteLayerInput = {
  doc: Y.Doc;
  layerId: string;
};

export type LayerIndicesInput = {
  array: Y.Array<unknown>;
  layerId: string;
};

export type MergeByIdInput<T> = {
  first: readonly T[];
  second: readonly T[];
};
