import type { OperationColumn, OperationColumnsInput, OperationTotals, SelectedNodeInput } from './operation-board.types';

import { doneCount, missionNodes } from '../mission-nodes';

export const operationColumns = ({ branches, progress, isTracked, label }: OperationColumnsInput): OperationColumn[] =>
  branches.map((branch) => {
    const nodes = missionNodes({ missions: branch.missions, progress, isTracked });

    return { branch, label: label(branch.key), nodes, done: doneCount(nodes) };
  });

export const operationTotals = (columns: readonly OperationColumn[]): OperationTotals => {
  const nodes = columns.flatMap((column) => column.nodes);

  return { done: doneCount(nodes), honors: nodes.filter((node) => node.state === 'honors').length };
};

export const selectedNode = ({ columns, questId }: SelectedNodeInput) => {
  const nodes = columns.flatMap((column) => column.nodes);

  return nodes.find((node) => node.mission.questId === questId) ?? nodes.find((node) => node.state === 'current') ?? nodes[0] ?? null;
};
