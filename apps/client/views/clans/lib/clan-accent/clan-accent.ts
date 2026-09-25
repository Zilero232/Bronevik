const hueOf = (tag: string) => [...tag.toUpperCase()].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7) % 360;

export const clanAccent = (tag: string) => `hsl(${hueOf(tag)} 78% 60%)`;
