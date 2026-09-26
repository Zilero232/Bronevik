export type BoardShareLinksInput = {
  origin: string;
  path: string;
  shareToken: string | null;
  editToken: string | null;
};

export type BoardShareLinks = {
  plain: string;
  view: string | null;
  edit: string | null;
};

export type TokenLinkInput = {
  base: string;
  token: string | null;
};
