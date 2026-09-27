import type { SeriesTone, SeriesToneInput } from './series-tone.types';

import { SERIES_TONES } from './series-tone.constants';

export const seriesTone = <Tone extends string>({ tone, index }: SeriesToneInput<Tone>): SeriesTone | Tone =>
  tone ?? SERIES_TONES[index % SERIES_TONES.length] ?? SERIES_TONES[0];
