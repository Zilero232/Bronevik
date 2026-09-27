import type { ConfirmProps } from './Confirm.types';

import { useT } from '../../model/hooks/use-t';
import { Button } from '../button';

import s from './Confirm.module.scss';

export const Confirm = ({ text, onConfirm, onCancel }: ConfirmProps) => {
  const t = useT();

  return (
    <div className={s.confirm}>
      <span className={s.text}>{text}</span>
      <Button className={s.button} variant='danger' onClick={onConfirm}>
        {t('confirm')}
      </Button>
      <Button className={s.button} variant='ghost' onClick={onCancel}>
        {t('cancel')}
      </Button>
    </div>
  );
};
