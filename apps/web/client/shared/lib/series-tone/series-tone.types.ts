import type { SERIES_TONES } from './series-tone.constants';

export type SeriesTone = (typeof SERIES_TONES)[number];

export type SeriesToneInput<Tone extends string> = {
  tone?: Tone;
  index: number;
};
