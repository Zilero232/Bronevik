import type { MedalChoiceInput } from './medal-choice.types';

export const pickMedal = ({ current, next }: MedalChoiceInput): string | null => next.find((medal) => medal !== current) ?? null;
