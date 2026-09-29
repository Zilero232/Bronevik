import type { ReactNode } from 'react';

import type { ArmorModelData } from '@/entities/armor/armor-model';

export type ArmorViewerCompare = {
  name: string;
  model: ArmorModelData | undefined;
  fallback: ReactNode;
};

export type ArmorViewerProps = {
  model: ArmorModelData;
  slug: string;
  compare?: ArmorViewerCompare;
};
