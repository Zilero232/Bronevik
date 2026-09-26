import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import type { OverflowReport, PageIssues } from './audit';
import type { ScreenParams } from './screens.constants';

import { SCREENS_PATHS } from './screens.constants';

export type ScreenEntry = PageIssues & {
  viewport: string;
  pattern: string;
  path: string;
  locale: string;
  signedIn: boolean;
  status: number | null;
  finalUrl: string;
  networkIdle: boolean;
  screenshot: string;
  overflow: OverflowReport;
};

const writeJson = (file: string, value: unknown) => {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const readJson = (file: string): unknown => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : undefined);

export const saveParams = (params: ScreenParams) => writeJson(SCREENS_PATHS.params, params);

export const loadParams = (): ScreenParams => {
  const value = readJson(SCREENS_PATHS.params);

  return typeof value === 'object' && value !== null ? { ...value } : {};
};

/** One file per test — parallel workers never write the same file; the teardown folds them together. */
export const saveEntry = (slug: string, entry: ScreenEntry) => writeJson(path.join(SCREENS_PATHS.raw, entry.viewport, `${slug}.json`), entry);

const hasIssues = (entry: ScreenEntry) =>
  entry.consoleErrors.length > 0 ||
  entry.pageErrors.length > 0 ||
  entry.failedRequests.length > 0 ||
  entry.overflow.horizontal ||
  entry.overflow.offenders.length > 0 ||
  (entry.status ?? 0) >= 400;

export const mergeReport = () => {
  const entries: unknown[] = existsSync(SCREENS_PATHS.raw)
    ? readdirSync(SCREENS_PATHS.raw, { recursive: true, encoding: 'utf8' })
        .filter((file) => file.endsWith('.json'))
        .sort()
        .map((file) => readJson(path.join(SCREENS_PATHS.raw, file)))
    : [];

  const typed = entries.filter((entry): entry is ScreenEntry => typeof entry === 'object' && entry !== null && 'viewport' in entry);
  const withIssues = typed.filter(hasIssues);

  writeJson(SCREENS_PATHS.report, {
    generatedAt: new Date().toISOString(),
    params: loadParams(),
    summary: {
      pages: typed.length,
      withIssues: withIssues.length,
      badStatus: typed.filter((entry) => (entry.status ?? 0) >= 400).length,
      consoleErrors: typed.filter((entry) => entry.consoleErrors.length > 0).length,
      pageErrors: typed.filter((entry) => entry.pageErrors.length > 0).length,
      failedRequests: typed.filter((entry) => entry.failedRequests.length > 0).length,
      horizontalOverflow: typed.filter((entry) => entry.overflow.horizontal).length,
      overflowingElements: typed.filter((entry) => entry.overflow.offenders.length > 0).length,
      networkNeverIdle: typed.filter((entry) => !entry.networkIdle).length
    },
    issues: withIssues,
    clean: typed.filter((entry) => !hasIssues(entry)).map((entry) => `${entry.viewport} ${entry.path}${entry.signedIn ? ' (signed in)' : ''}`)
  });
};
