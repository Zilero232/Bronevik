import type { BoardListProps } from './BoardList.types';

import { BoardRow } from '../BoardRow';

import s from './BoardList.module.scss';

export const BoardList = ({ boards }: BoardListProps) => (
  <ul className={s.root}>
    {boards.map((board) => (
      <BoardRow key={board.id} board={board} />
    ))}
  </ul>
);
