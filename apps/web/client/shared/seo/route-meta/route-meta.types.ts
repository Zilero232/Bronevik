export type RouteStaticParamsInput = {
  fallback?: string;
  limit?: number;
};

export type RouteEntityInput = {
  key: string;
  load: () => Promise<string>;
};

export type RouteEntity = {
  name: string;
  isFound: boolean;
};

export type RouteLookup = RouteEntity & {
  isAvailable: boolean;
};

export type RouteLookupInput = Pick<RouteEntityInput, 'key'> & {
  lookup: (key: string) => Promise<RouteLookup>;
};

export type RouteSlugsInput = Pick<RouteStaticParamsInput, 'fallback'> & {
  load: () => Promise<string[]>;
};
