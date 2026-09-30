import type { ConfirmProps } from './Confirm.types';

import { useEscapeLayer } from '../../lib/use-escape-layer';
import { Button } from '../button';

import s from './Confirm.module.scss';

export const Confirm = ({ text, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmProps) => {
  useEscapeLayer({ kind: 'confirm', onEscape: onCancel });

  return (
    <div className={s.confirm} role='alert'>
      <span className={s.text}>{text}</span>
      <Button className={s.button} variant='danger' onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button className={s.button} variant='ghost' onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
};
