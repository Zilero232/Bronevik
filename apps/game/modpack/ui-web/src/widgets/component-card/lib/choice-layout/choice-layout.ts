import { sumBy } from 'remeda';

import type { FieldOf } from '../../../../shared/api/protocol';

import { CHOICE_LAYOUT } from '../../config';

export const choiceLayout = (choices: FieldOf<'choice'>['choices']): 'list' | 'segmented' =>
  choices.length > CHOICE_LAYOUT.maxSegments || sumBy(choices, ({ label }) => label.length) > CHOICE_LAYOUT.maxSegmentChars ? 'list' : 'segmented';
