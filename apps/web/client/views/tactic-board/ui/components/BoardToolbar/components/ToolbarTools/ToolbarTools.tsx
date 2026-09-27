'use client';

import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import { BOARD_TOOL_ICONS, BOARD_TOOLBAR_TOOLS } from '../../../../../config';
import { useBoardToolbar } from '../../../../../model/hooks';

export const ToolbarTools = () => {
  const t = useTranslations('tactics.toolbar');
  const { tool, onToolChange } = useBoardToolbar();

  return (
    <>
      {BOARD_TOOLBAR_TOOLS.map((value) => {
        const Icon = BOARD_TOOL_ICONS[value];

        return (
          <IconButton
            key={value}
            aria-label={t(`tools.${value}`)}
            isActive={tool === value}
            size='sm'
            title={t(`tools.${value}`)}
            onClick={() => onToolChange(value)}
          >
            <Icon size={16} />
          </IconButton>
        );
      })}
    </>
  );
};
