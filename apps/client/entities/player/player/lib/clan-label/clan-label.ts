import type { ClanLabelInput } from './clan-label.types';

export const clanLabel = ({ tag, name }: ClanLabelInput): string => (name ? `[${tag}] ${name}` : `[${tag}]`);
