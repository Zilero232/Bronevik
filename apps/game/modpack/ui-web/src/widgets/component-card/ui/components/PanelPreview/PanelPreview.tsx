import type { PanelPreviewProps } from './PanelPreview.types';

import { useT } from '../../../../../entities/window-state';
import { Button } from '../../../../../shared/ui/button';

import s from './PanelPreview.module.scss';

export const PanelPreview = ({ preview, onMove }: PanelPreviewProps) => {
  const t = useT();

  return (
    <div className={s.preview}>
      <div className={s.screen}>
        <span className={s.caption}>{t('preview')}</span>
        {preview && <span className={s.plate}>{preview}</span>}
      </div>
      <Button className={s.move} size='small' onClick={onMove}>
        {t('moveOnScreen')}
      </Button>
    </div>
  );
};
