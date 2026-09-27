import { match, P } from 'ts-pattern';

import type { StatValueTextInput } from './stat-value.types';

import { STAT_VALUE } from './stat-value.constants';

export const statValueText = ({ value, kind = 'count', locale }: StatValueTextInput): string =>
  match(value)
    .with(P.nullish, () => STAT_VALUE.empty)
    .with(P.string, (text) => text)
    .when(
      (known) => !Number.isFinite(known),
      () => STAT_VALUE.empty
    )
    .otherwise((known) => new Intl.NumberFormat(locale, STAT_VALUE.formats[kind]).format(kind === 'percent' ? known / 100 : known));
