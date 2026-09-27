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

export type RouteLookupInput = Pick<RouteEntityInput, 'key'> & {
  lookup: (key: string) => Promise<RouteEntity>;
};

export type RouteSlugsInput = Pick<RouteStaticParamsInput, 'fallback'> & {
  load: () => Promise<string[]>;
};
