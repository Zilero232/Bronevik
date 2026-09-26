'use client';

import { useTranslations } from 'next-intl';

import { useBoardToolbar } from '../../../model/hooks';
import { ToolbarHistory, ToolbarIcons, ToolbarStroke, ToolbarTools } from './components';

import s from './BoardToolbar.module.scss';

export const BoardToolbar = () => {
  const t = useTranslations('tactics.toolbar');
  const { isEditable } = useBoardToolbar();

  if (!isEditable) {
    return null;
  }

  return (
    <div aria-label={t('label')} className={s.root} role='toolbar'>
      <div className={s.group}>
        <ToolbarTools />
      </div>
      <div className={s.group}>
        <ToolbarIcons />
      </div>
      <div className={s.group}>
        <ToolbarStroke />
      </div>
      <div className={s.group}>
        <ToolbarHistory />
      </div>
    </div>
  );
};
