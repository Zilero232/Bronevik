import type { DependencyRow, DependencyRowsInput } from './dependencies.types';

import { INSTALL_WIZARD } from '../../config';

const lockedStates = new Set<string>(INSTALL_WIZARD.lockedDependencyStates);

export const dependencyRows = ({ dependencies, statuses, selection, excluded }: DependencyRowsInput): DependencyRow[] =>
  dependencies
    .filter((dependency) => dependency.requiredBy.some((id) => selection.has(id)))
    .map((dependency) => {
      const status = statuses.find((item) => item.id === dependency.id);
      const state = status?.state ?? 'missing';
      const locked = lockedStates.has(state);

      return {
        dependency,
        state,
        file: status?.file ?? null,
        checked: state === 'ours' || (!locked && !excluded.has(dependency.id)),
        locked
      };
    });

export const installedDependencies = (rows: readonly DependencyRow[]): DependencyRow[] => rows.filter((row) => row.checked && !row.locked);

export const needsClientRestart = (rows: readonly DependencyRow[]): boolean =>
  installedDependencies(rows).some((row) => row.dependency.restartRequired && row.state === 'missing');
