import { useT } from '../../../../../entities/window-state';
import { LogoMark } from '../../../../../shared/ui/logo-mark';
import { HEADER } from '../../../config';

import s from './Brand.module.scss';

export const Brand = () => {
  const t = useT();

  return (
    <div className={s.brand}>
      <LogoMark className={s.mark} size={HEADER.logoSize} />
      <div className={s.text}>
        <span className={s.title}>{t('title')}</span>
        <span className={s.subtitle}>{t('subtitle')}</span>
      </div>
    </div>
  );
};
