import type { BrandProps } from './Brand.types';

import { useT } from '../../../../../entities/window-state';
import { LogoMark } from '../../../../../shared/ui/logo-mark';
import { HEADER } from '../../../config';

import s from './Brand.module.scss';

export const Brand = ({ compact, dragRef, onRecentre }: BrandProps) => {
  const t = useT();

  return (
    <div ref={dragRef} aria-label={t('dragHint')} className={s.brand} title={t('dragHint')} onDblClick={onRecentre}>
      <LogoMark className={s.mark} size={HEADER.logoSize} />
      <div className={s.text}>
        <span className={s.title}>{t('title')}</span>
        {!compact && <span className={s.subtitle}>{t('subtitle')}</span>}
      </div>
    </div>
  );
};
