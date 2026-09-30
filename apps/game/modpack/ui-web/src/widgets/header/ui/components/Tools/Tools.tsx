import type { ToolsProps } from './Tools.types';

import { useT } from '../../../../../entities/window-state';
import { IconButton } from '../../../../../shared/ui/icon-button';
import { Segmented } from '../../../../../shared/ui/segmented';
import { LANGUAGE_ITEMS } from '../../../config';
import { closeWindow, selectLanguage } from '../../../model/actions';

import s from './Tools.module.scss';

export const Tools = ({ language }: ToolsProps) => {
  const t = useT();

  return (
    <div className={s.tools}>
      <Segmented className={s.tool} items={LANGUAGE_ITEMS} label={t('language')} value={language} onSelect={selectLanguage} />
      <IconButton className={s.tool} icon='x' label={t('close')} onClick={closeWindow} />
    </div>
  );
};
