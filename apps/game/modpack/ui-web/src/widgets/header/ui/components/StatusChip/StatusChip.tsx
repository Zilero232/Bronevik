import clsx from 'clsx';

import type { StatusChipProps } from './StatusChip.types';

import { useT } from '../../../../../entities/window-state';

import s from './StatusChip.module.scss';

export const StatusChip = ({ status }: StatusChipProps) => {
  const t = useT();

  return (
    <div aria-live='polite' className={s.status} role='status'>
      <span className={clsx(s.chip, status.bound ? s.chipOk : s.chipWarn)}>{status.bound ? t('bound') : t('unbound')}</span>
      <span className={s.text}>{status.text}</span>
    </div>
  );
};
