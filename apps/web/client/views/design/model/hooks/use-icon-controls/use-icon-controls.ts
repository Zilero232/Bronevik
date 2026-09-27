'use client';

import { useState } from 'react';

import type { IconSize, IconSizing, IconStroke } from './use-icon-controls.types';

import { DESIGN_ICONS } from '../../../config';

export const useIconControls = () => {
  const [size, setSize] = useState<IconSize>(DESIGN_ICONS.defaultSize);
  const [stroke, setStroke] = useState<IconStroke>(DESIGN_ICONS.defaultStroke);

  const iconProps: IconSizing = { size: Number(size), strokeWidth: Number(stroke) };

  return { size, stroke, iconProps, setSize, setStroke };
};
