import type { FoliageKind } from '@otmetki/gamedata';
import type { ReactNode } from 'react';
import type { Control } from 'react-hook-form';

import type { SegmentedOption } from '@/ui-kit';

import type { TANK_MATH_SIDES } from '../../../../../config';
import type { SpottingFormValues } from '../../../../../lib/spotting-form';

export type SpottingSideFieldsProps = {
  side: (typeof TANK_MATH_SIDES)[number];
  title: ReactNode;
  control: Control<SpottingFormValues>;
  foliage: readonly SegmentedOption<FoliageKind>[];
  children?: ReactNode;
};
