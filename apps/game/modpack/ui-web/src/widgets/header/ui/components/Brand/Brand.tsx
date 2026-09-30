import type { BrandProps } from './Brand.types';

import { useT } from '../../../../../entities/window-state';
import { LogoMark } from '../../../../../shared/ui/logo-mark';
import { HEADER } from '../../../config';

import s from './Brand.module.scss';

export const Brand = ({ compact, onMoveStart, onRecentre }: BrandProps) => {
  const t = useT();

  return (
    <button aria-label={t('dragHint')} className={s.brand} title={t('dragHint')} type='button' onDblClick={onRecentre} onMouseDown={onMoveStart}>
      <LogoMark className={s.mark} size={HEADER.logoSize} />
      <div className={s.text}>
        <span className={s.title}>{t('title')}</span>
        {!compact && <span className={s.subtitle}>{t('subtitle')}</span>}
      </div>
    </button>
  );
};
