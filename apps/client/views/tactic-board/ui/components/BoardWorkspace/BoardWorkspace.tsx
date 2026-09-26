'use client';

import type { BoardWorkspaceProps } from './BoardWorkspace.types';

import { BoardWorkspaceProvider } from '../../../model/context';
import { BoardStatus } from '../BoardStatus';
import { BoardSurface } from '../BoardSurface';
import { BoardToolbar } from '../BoardToolbar';
import { LayersPanel } from '../LayersPanel';

import s from './BoardWorkspace.module.scss';

export const BoardWorkspace = ({ board, urlToken }: BoardWorkspaceProps) => (
  <BoardWorkspaceProvider board={board} urlToken={urlToken}>
    <section className={s.root}>
      <BoardToolbar />
      <div className={s.body}>
        <BoardSurface />
        <aside className={s.side}>
          <BoardStatus />
          <LayersPanel />
        </aside>
      </div>
    </section>
  </BoardWorkspaceProvider>
);
