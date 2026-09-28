import catalog from '@contract/catalog.json';
import plan from '@contract/install-plan.json';
import { describe, expect, it } from 'vitest';

import { catalogSchema } from '@/entities/catalog';
import { installPlanSchema } from '@/features/setup/install-modpack';

import { dependencyRows, installedDependencies, needsClientRestart } from '../dependencies';

const { dependencies } = catalogSchema.parse(catalog);
const { dependencies: statuses } = installPlanSchema.parse(plan);
const none = new Set<string>();

describe('dependencyRows', () => {
  it('lists only the dependencies a selected component needs', () => {
    const rows = dependencyRows({ dependencies, statuses: [], selection: new Set(['marks_panel']), excluded: none });

    expect(rows.map((row) => row.dependency.id)).toEqual(['openwg_gameface']);
    expect(dependencyRows({ dependencies, statuses: [], selection: new Set(['core']), excluded: none })).toEqual([]);
  });

  it('ticks a missing dependency automatically and lets the player untick it', () => {
    const selection = new Set(['damage_log']);
    const [gameface] = dependencyRows({ dependencies, statuses: [], selection, excluded: none });
    const [unticked] = dependencyRows({ dependencies, statuses: [], selection, excluded: new Set(['openwg_gameface']) });

    expect(gameface).toMatchObject({ state: 'missing', checked: true, locked: false });
    expect(unticked).toMatchObject({ checked: false, locked: false });
  });

  it('locks what is already there: ours stays, the players copy is never replaced', () => {
    const rows = dependencyRows({ dependencies, statuses, selection: new Set(['damage_log']), excluded: none });

    expect(rows.find((row) => row.dependency.id === 'openwg_gameface')).toMatchObject({ state: 'ours', checked: true, locked: true });
    expect(rows.find((row) => row.dependency.id === 'guiflash')).toMatchObject({ state: 'user', checked: false, locked: true });
    expect(installedDependencies(rows)).toEqual([]);
  });
});

describe('needsClientRestart', () => {
  it('asks for the one restart only when a new dependency needs it', () => {
    const selection = new Set(['damage_log']);

    expect(needsClientRestart(dependencyRows({ dependencies, statuses: [], selection, excluded: none }))).toBe(true);
    expect(needsClientRestart(dependencyRows({ dependencies, statuses: [], selection, excluded: new Set(['openwg_gameface']) }))).toBe(false);
    expect(needsClientRestart(dependencyRows({ dependencies, statuses, selection, excluded: none }))).toBe(false);
  });
});
