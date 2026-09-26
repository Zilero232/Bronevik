import { readdirSync } from 'node:fs';
import path from 'node:path';

import type { ScreenParams } from './screens.constants';

import { SCREENS_AUTH_PATTERN, SCREENS_EN_PATTERNS, SCREENS_GROUPS, SCREENS_PARAM_KEYS, SCREENS_PATHS } from './screens.constants';

export type ScreenLocale = 'en' | 'ru';

export type ScreenRoute = {
  /** `/t/[slug]` — the page's path under `[locale]`, route groups stripped. */
  pattern: string;
  locale: ScreenLocale;
  /** Whether the page belongs in the signed-in pass. */
  needsAuth: boolean;
};

const isRouteGroup = (segment: string) => segment.startsWith('(') && segment.endsWith(')');

const isCatchAll = (segment: string) => segment.startsWith('[...') || segment.startsWith('[[...');

const patternOf = (file: string): string | null => {
  const segments = path.dirname(file).split(/[\\/]/).filter(Boolean);

  if (segments.some(isCatchAll)) {
    return null;
  }

  return `/${segments.filter((segment) => segment !== '.' && !isRouteGroup(segment)).join('/')}`;
};

/** Every `page.tsx` under the walked route groups, read from disk so new pages join the tour on their own. */
export const collectPatterns = (groups: readonly string[] = SCREENS_GROUPS): string[] => {
  const patterns = new Set<string>();

  for (const group of groups) {
    const dir = path.join(SCREENS_PATHS.appDir, group);
    const files = readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((file) => path.basename(file) === 'page.tsx');

    for (const file of files) {
      const pattern = patternOf(path.join(group, file));

      if (pattern !== null) {
        patterns.add(pattern);
      }
    }
  }

  return [...patterns].sort();
};

export const collectRoutes = (): ScreenRoute[] => {
  const patterns = collectPatterns();
  const english = new Set<string>(SCREENS_EN_PATTERNS);

  return [
    ...patterns.map((pattern): ScreenRoute => ({ pattern, locale: 'ru', needsAuth: SCREENS_AUTH_PATTERN.test(pattern) })),
    ...patterns
      .filter((pattern) => english.has(pattern))
      .map((pattern): ScreenRoute => ({ pattern, locale: 'en', needsAuth: SCREENS_AUTH_PATTERN.test(pattern) }))
  ];
};

export type FilledRoute = { missing: string } | { path: string };

/** Substitutes discovered params into the pattern; names the first segment nothing was found for. */
export const fillRoute = (route: ScreenRoute, params: ScreenParams): FilledRoute => {
  const segments = route.pattern.split('/').filter(Boolean);
  const filled: string[] = [];

  for (const [index, segment] of segments.entries()) {
    if (!segment.startsWith('[')) {
      filled.push(segment);

      continue;
    }

    const key = SCREENS_PARAM_KEYS[`${segments[index - 1] ?? ''}/${segment}`];
    const value = key ? params[key] : undefined;

    if (!value) {
      return { missing: segment };
    }

    filled.push(encodeURIComponent(value));
  }

  const prefix = route.locale === 'ru' ? '' : `/${route.locale}`;
  const rest = filled.length > 0 ? `/${filled.join('/')}` : '';

  return { path: `${prefix}${rest}` || '/' };
};

/** A filesystem-safe name for the screenshot: `ru--t--r45-is-7`. */
export const routeSlug = (locale: ScreenLocale, routePath: string, signedIn: boolean): string => {
  const body = routePath
    .replace(/^\/(?:en|ru)(?=\/|$)/, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment).replace(/[^\p{L}\p{N}_-]+/gu, '-'))
    .join('--');

  return [signedIn ? 'auth' : null, locale, body || 'home'].filter(Boolean).join('--');
};
