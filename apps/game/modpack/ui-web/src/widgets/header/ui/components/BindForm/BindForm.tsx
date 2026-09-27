import { useT } from '../../../../../entities/window-state';
import { Button } from '../../../../../shared/ui/button';
import { Input } from '../../../../../shared/ui/input';
import { HEADER } from '../../../config';
import { useBindForm } from '../../../model/hooks';

import s from './BindForm.module.scss';

export const BindForm = () => {
  const t = useT();
  const form = useBindForm();

  return (
    <div className={s.bind}>
      <Input
        aria-label={t('bindPlaceholder')}
        className={s.input}
        maxLength={HEADER.bindCodeMaxLength}
        placeholder={t('bindPlaceholder')}
        value={form.code}
        variant='code'
        onInput={(event) => form.setCode(event.currentTarget.value)}
        onKeyDown={(event) => form.onKey(event.key)}
      />
      <Button variant='accent' onClick={form.bind}>
        {t('bind')}
      </Button>
    </div>
  );
};
