import { AVATAR_INITIALS } from './avatar-initials.constants';

export const avatarInitials = (name: string) => {
  const initials = name
    .split(AVATAR_INITIALS.wordSeparator)
    .filter(Boolean)
    .slice(0, AVATAR_INITIALS.letters)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || AVATAR_INITIALS.fallback;
};

export const avatarHue = (name: string) => {
  const { seed, multiplier, range } = AVATAR_INITIALS.hue;

  return [...name].reduce<number>((hash, char) => (hash * multiplier + char.charCodeAt(0)) % range, seed);
};
