import type { RouteMatchCallback, RuntimeCaching } from 'serwist';

import { RegExpRoute } from 'serwist';

const matcherOf = ({ matcher, handler, method }: RuntimeCaching): RouteMatchCallback => {
  if (matcher instanceof RegExp) {
    return new RegExpRoute(matcher, handler, method).match;
  }

  if (typeof matcher === 'string') {
    return ({ url }) => new URL(matcher, url).href === url.href;
  }

  return matcher;
};

export const sameOriginCaching = (entries: readonly RuntimeCaching[]): (RuntimeCaching & { matcher: RouteMatchCallback })[] =>
  entries.map((entry) => {
    const matches = matcherOf(entry);

    return { ...entry, matcher: (options) => options.sameOrigin && matches(options) };
  });
