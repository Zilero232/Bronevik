'use client';

import type { TreeWorkspaceProps } from './TreeWorkspace.types';

import { pathCost, pathTo } from '../../../lib/tree-path';
import { useTreeParams } from '../../../model/hooks';
import { PathAside } from '../PathAside';
import { PremiumStrip } from '../PremiumStrip';
import { TreeCanvas } from '../TreeCanvas';

import s from './TreeWorkspace.module.scss';

export const TreeWorkspace = ({ tree, premiums, layout }: TreeWorkspaceProps) => {
  const { selectedId, selectTank } = useTreeParams();

  const path = selectedId === null ? [] : pathTo({ nodes: tree.nodes, edges: tree.edges, targetId: selectedId });
  const selected = tree.nodes.find(({ vehicle }) => vehicle.tankId === path.at(-1)) ?? null;
  const cost = pathCost({ nodes: tree.nodes, path });
  const steps = path.flatMap((id) => tree.nodes.filter(({ vehicle }) => vehicle.tankId === id));

  return (
    <div className={s.root}>
      <div className={s.stage}>
        <TreeCanvas layout={layout} path={path} tree={tree} onSelect={selectTank} />
        <PathAside cost={cost} selected={selected} steps={steps} onClear={() => selectTank(null)} />
      </div>
      <PremiumStrip premiums={premiums} />
    </div>
  );
};
