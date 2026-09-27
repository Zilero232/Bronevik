'use client';

import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import { BOARD_COLORS, BOARD_WIDTHS } from '../../../../../config';
import { useBoardToolbar } from '../../../../../model/hooks';

import s from './ToolbarStroke.module.scss';

export const ToolbarStroke = () => {
  const t = useTranslations('tactics.toolbar');
  const { color, width, onColorChange, onWidthChange } = useBoardToolbar();

  return (
    <>
      <div aria-label={t('color')} className={s.swatches} role='radiogroup'>
        {BOARD_COLORS.map((value) => (
          <button
            key={value}
            aria-checked={color === value}
            aria-label={value}
            className={s.swatch}
            role='radio'
            style={{ backgroundColor: value }}
            type='button'
            onClick={() => onColorChange(value)}
          />
        ))}
      </div>
      <SegmentedControl
        options={BOARD_WIDTHS.map((value) => ({
          value: String(value),
          label: <span className={s.width} style={{ height: value }} />,
          'aria-label': String(value)
        }))}
        aria-label={t('width')}
        size='sm'
        value={width}
        onChange={onWidthChange}
      />
    </>
  );
};
