import type { Locator } from '@playwright/test';

import { expect } from '@playwright/test';

const REACT_PROPS_PREFIX = '__reactProps';

export const waitForHydration = async (locator: Locator): Promise<void> => {
  await expect
    .poll(async () => locator.evaluate((node, prefix) => Object.keys(node).some((key) => key.startsWith(prefix)), REACT_PROPS_PREFIX))
    .toBe(true);
};
