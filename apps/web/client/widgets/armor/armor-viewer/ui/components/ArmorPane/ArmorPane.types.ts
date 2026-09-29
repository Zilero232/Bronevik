import type { ArmorModelData } from '@/entities/armor/armor-model';

import type { ArmorCanvasProps } from '../ArmorCanvas';

export type ArmorPaneProps = Omit<ArmorCanvasProps, 'geometry' | 'isLeader' | 'syncId'> & {
  model: ArmorModelData;
  paneKey: ArmorCanvasProps['syncId'];
  leader: ArmorCanvasProps['syncId'];
  showName: boolean;
};
