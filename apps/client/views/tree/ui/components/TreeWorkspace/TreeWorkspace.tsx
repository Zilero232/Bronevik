'use client';

import { DataSourceNote } from '@/ui-kit';

import type { TreeWorkspaceProps } from './TreeWorkspace.types';

import { useTreeWorkspace } from '../../../model/hooks';
import { PathAside } from '../PathAside';
import { PremiumStrip } from '../PremiumStrip';
import { TreeCanvas } from '../TreeCanvas';

import s from './TreeWorkspace.module.scss';

export const TreeWorkspace = ({ tree, premiums, layout }: TreeWorkspaceProps) => {
  const { path, steps, selected, cost, selectTank, onClear } = useTreeWorkspace(tree);

  return (
    <div className={s.root}>
      <div className={s.stage}>
        <TreeCanvas layout={layout} path={path} tree={tree} onSelect={selectTank} />
        <PathAside cost={cost} selected={selected} steps={steps} onClear={onClear} />
      </div>
      <PremiumStrip premiums={premiums} />
      <DataSourceNote />
    </div>
  );
};
