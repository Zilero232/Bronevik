import type { MatchTankNamesInput } from './tank-mentions.types';

const escape = (value: string): string => value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

const normalize = (value: string): string => value.replaceAll(/\s+/g, ' ').toLowerCase();

export const matchTankNames = ({ text, vehicles, minLength }: MatchTankNamesInput): number[] => {
  const haystack = normalize(text);
  const found = new Set<number>();

  for (const vehicle of vehicles) {
    const name = normalize(vehicle.name.trim());

    if (name.length < minLength || !haystack.includes(name)) {
      continue;
    }

    if (new RegExp(`(^|[^\\p{L}\\p{N}])${escape(name)}($|[^\\p{L}\\p{N}])`, 'u').test(haystack)) {
      found.add(vehicle.tankId);
    }
  }

  return [...found].sort((a, b) => a - b);
};
