const WORD_SEPARATOR = /[\s_\-.]+/;

export const avatarInitials = (name: string) => {
  const initials = name
    .split(WORD_SEPARATOR)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || '?';
};

export const avatarHue = (name: string) => [...name].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 360, 17);
