import type { ConfirmProps } from './Confirm.types';

import { useT } from '../../model/hooks/use-t/use-t';

export const Confirm = ({ text, onConfirm, onCancel }: ConfirmProps) => {
  const t = useT();

  return (
    <div className='confirm'>
      <span className='confirm__text'>{text}</span>
      <button className='button button--danger' type='button' onClick={onConfirm}>
        {t('confirm')}
      </button>
      <button className='button button--ghost' type='button' onClick={onCancel}>
        {t('cancel')}
      </button>
    </div>
  );
};
