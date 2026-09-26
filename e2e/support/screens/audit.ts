import type { Page } from '@playwright/test';

import { SCREENS_EXPECTED_FAILURES, SCREENS_FREEZE_CSS, SCREENS_TIMING } from './screens.constants';

export type FailedRequest = { url: string; method: string; status: number | null; error?: string };

export type PageIssues = {
  consoleErrors: string[];
  pageErrors: string[];
  failedRequests: FailedRequest[];
};

export type OverflowOffender = { selector: string; text: string; left: number; right: number; width: number };

export type OverflowReport = {
  viewportWidth: number;
  scrollWidth: number;
  horizontal: boolean;
  offenders: OverflowOffender[];
};

const isExpected = (status: number, url: string) =>
  SCREENS_EXPECTED_FAILURES.some((expected) => expected.status === status && expected.url.test(url));

/** Starts recording console errors, uncaught exceptions and failed requests; read the returned object after the page settles. */
export const recordIssues = (page: Page): PageIssues => {
  const issues: PageIssues = { consoleErrors: [], pageErrors: [], failedRequests: [] };

  page.on('console', (message) => {
    if (message.type() === 'error') {
      issues.consoleErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    issues.pageErrors.push(error.stack ?? error.message);
  });

  page.on('response', (response) => {
    const status = response.status();

    if (status >= 400 && !isExpected(status, response.url())) {
      issues.failedRequests.push({ url: response.url(), method: response.request().method(), status });
    }
  });

  page.on('requestfailed', (request) => {
    const error = request.failure()?.errorText ?? 'unknown';

    // Navigations and RSC prefetches cancelled mid-flight are noise, not failures.
    if (!error.includes('ERR_ABORTED')) {
      issues.failedRequests.push({ url: request.url(), method: request.method(), status: null, error });
    }
  });

  return issues;
};

/** Waits for the network and fonts, freezes animation, and scrolls once through the page so lazy content is in the shot. */
export const settle = async (page: Page): Promise<{ networkIdle: boolean }> => {
  const networkIdle = await page
    .waitForLoadState('networkidle', { timeout: SCREENS_TIMING.networkIdleMs })
    .then(() => true)
    .catch(() => false);

  await page.addStyleTag({ content: SCREENS_FREEZE_CSS });

  await page.evaluate(
    async ({ step, maxSteps }) => {
      for (let index = 0; index < maxSteps && window.scrollY + window.innerHeight < document.documentElement.scrollHeight; index += 1) {
        window.scrollBy(0, step);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      window.scrollTo(0, 0);
      await document.fonts.ready;
    },
    { step: SCREENS_TIMING.lazyScrollStepPx, maxSteps: SCREENS_TIMING.lazyScrollMaxSteps }
  );

  await page.waitForLoadState('networkidle', { timeout: SCREENS_TIMING.networkIdleMs }).catch(() => undefined);

  return { networkIdle };
};

/**
 * Horizontal overflow: the document wider than the viewport, plus the outermost visible
 * elements that stick out of it without an ancestor that clips or scrolls them.
 */
export const measureOverflow = (page: Page, withOffenders: boolean): Promise<OverflowReport> =>
  page.evaluate(
    ({ collect, limit }) => {
      const root = document.documentElement;
      const viewportWidth = root.clientWidth;
      const scrollWidth = root.scrollWidth;

      const clipsX = (element: Element) => {
        const overflowX = getComputedStyle(element).overflowX;

        return overflowX !== 'visible';
      };

      const describe = (element: Element) => {
        const id = element.id ? `#${element.id}` : '';
        const classes = [...element.classList]
          .slice(0, 3)
          .map((name) => `.${name}`)
          .join('');

        const testId = element.getAttribute('data-testid');

        return `${element.tagName.toLowerCase()}${id}${classes}${testId ? `[data-testid="${testId}"]` : ''}`;
      };

      const sticksOut = (element: Element) => {
        const rect = element.getBoundingClientRect();

        return rect.width > 0 && rect.height > 0 && (rect.right > viewportWidth + 1 || rect.left < -1);
      };

      const clippedByAncestor = (element: Element) => {
        for (let parent = element.parentElement; parent && parent !== document.body && parent !== root; parent = parent.parentElement) {
          if (clipsX(parent)) {
            return true;
          }
        }

        return false;
      };

      const offenders = collect
        ? [...document.body.querySelectorAll('*')]
            .filter((element) => sticksOut(element) && !clippedByAncestor(element))
            .filter((element) => !element.parentElement || !sticksOut(element.parentElement) || element.parentElement === document.body)
            .slice(0, limit)
            .map((element) => {
              const rect = element.getBoundingClientRect();

              return {
                selector: describe(element),
                text: (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                width: Math.round(rect.width)
              };
            })
        : [];

      return { viewportWidth, scrollWidth, horizontal: scrollWidth > viewportWidth, offenders };
    },
    { collect: withOffenders, limit: SCREENS_TIMING.maxOffenders }
  );
