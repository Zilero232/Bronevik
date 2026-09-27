import type { BoardShareLinks, BoardShareLinksInput, TokenLinkInput } from './share-links.types';

const withToken = ({ base, token }: TokenLinkInput) => (token ? `${base}?${new URLSearchParams({ token }).toString()}` : null);

export const boardShareLinks = ({ origin, path, shareToken, editToken }: BoardShareLinksInput): BoardShareLinks => {
  const base = `${origin.replace(/\/+$/, '')}${path}`;

  return { plain: base, view: withToken({ base, token: shareToken }), edit: withToken({ base, token: editToken }) };
};
