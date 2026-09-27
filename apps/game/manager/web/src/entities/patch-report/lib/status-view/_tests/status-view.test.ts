import reports from '@contract/patch-reports.json';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { patchReportSchema } from '@/entities/patch-report';

import { statusMessageValues, statusView } from '../status-view';

const statuses = z
  .array(patchReportSchema)
  .parse(reports)
  .map((report) => report.status);

describe('statusView', () => {
  it('offers the update only when a newer release is out', () => {
    const withUpdate = statuses.filter((status) => statusView({ status, needsMigration: false }).action === 'update');

    expect(withUpdate.map((status) => status.kind)).toEqual(['update_available']);
  });

  it('offers to move the modpack when the client was patched and nothing moved it yet', () => {
    const waiting = statuses.find((status) => status.kind === 'waiting');

    expect(waiting && statusView({ status: waiting, needsMigration: true }).action).toBe('migrate');
  });

  it('shows failures in the danger tone', () => {
    const failed = statuses.filter((status) => statusView({ status, needsMigration: false }).tone === 'danger');

    expect(failed.map((status) => status.kind).toSorted()).toEqual(['failed', 'offline']);
  });
});

describe('statusMessageValues', () => {
  it('keeps only the text fields a message can interpolate', () => {
    const updated = statuses.find((status) => status.kind === 'update_available');
    const values = updated ? statusMessageValues({ status: updated, modpackVersion: null }) : {};

    expect(Object.values(values).every((value) => typeof value === 'string')).toBe(true);
    expect(values).not.toHaveProperty('notes');
    expect(values.version).toBe('');
  });
});
