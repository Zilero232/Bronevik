export type MapDetailInput = {
  idOrSlug: string;
  signal?: AbortSignal;
};

export type MapListInput = {
  mode?: string;
  search?: string;
  signal?: AbortSignal;
};

export type MinimapUrlInput = {
  arenaId: string;
  mode?: string;
};
