import { test as teardown } from '@playwright/test';

import { mergeReport } from './support/screens/report';

teardown('merge the screenshot tour report', () => {
  mergeReport();
});
