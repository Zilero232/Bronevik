import type { ToolsProps } from './Tools.types';

import { useT } from '../../../../../entities/window-state';
import { Button } from '../../../../../shared/ui/button';
import { Segmented } from '../../../../../shared/ui/segmented';
import { HEADER, LANGUAGE_ITEMS } from '../../../config';
import { closeWindow, openSite, selectLanguage } from '../../../model/actions';

import s from './Tools.module.scss';

export const Tools = ({ language }: ToolsProps) => {
  const t = useT();

  return (
    <div className={s.tools}>
      <Button className={s.tool} variant='ghost' onClick={openSite}>
        {t('openSite')}
      </Button>
      <Segmented className={s.tool} items={LANGUAGE_ITEMS} label={t('language')} value={language} onSelect={selectLanguage} />
      <Button aria-label={t('close')} className={s.tool} size='icon' title={t('close')} onClick={closeWindow}>
        {HEADER.closeGlyph}
      </Button>
    </div>
  );
};
