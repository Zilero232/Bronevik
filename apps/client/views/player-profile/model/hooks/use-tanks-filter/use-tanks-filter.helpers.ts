import type { MatchesTankQueryInput, ToggleValueInput } from './use-tanks-filter.helpers.types';

export const toggleValue = <T>({ values, value }: ToggleValueInput<T>): T[] =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

const normalize = (value: string) => value.toLocaleLowerCase('ru').replaceAll(/[\s\-.]/g, '');

export const matchesTankQuery = ({ name, query }: MatchesTankQueryInput) => normalize(name).includes(normalize(query));
