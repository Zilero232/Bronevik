'use client';

import { useState } from 'react';

import { describeHit } from '@/features/armor/armor-inspect';

import type { ArmorHover, ArmorHoverEvent, UseArmorHoverInput } from './use-armor-hover.types';

import { toHitLayers } from '../../../lib/ray-layers';

const TOOLTIP_FLIP_MARGIN = 260;

export const useArmorHover = ({ shellState, hideSpaced }: UseArmorHoverInput) => {
  const [hover, setHover] = useState<ArmorHover | null>(null);

  const onHover = ({ hits, x, y, width }: ArmorHoverEvent) => {
    const layers = toHitLayers({ hits, hideSpaced });
    const report = describeHit({ layers, shell: shellState.shell, randomness: shellState.randomness });
    const kind = hits.find(({ piece }) => piece === layers[0]?.piece)?.kind;

    setHover(report && kind ? { report, kind, x, y, flip: x > width - TOOLTIP_FLIP_MARGIN } : null);
  };

  const onLeave = () => setHover(null);

  return { hover, onHover, onLeave };
};
