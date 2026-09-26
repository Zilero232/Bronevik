import type { CodeCellProps } from './CodeCell.types';

import s from './CodeCell.module.scss';

export const CodeCell = ({ code, message }: CodeCellProps) => (
  <span className={s.root} title={message ?? undefined}>
    {code ?? '—'}
    {message && <span className={s.message}>{message}</span>}
  </span>
);
