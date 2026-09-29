import { traceArmorRay } from '@otmetki/gamedata';

import type { DescribeHitInput, HitReport } from './hit-report.types';

export const describeHit = ({ layers, shell, randomness }: DescribeHitInput): HitReport | null => {
  if (layers.length === 0) {
    return null;
  }

  const trace = traceArmorRay({
    layers: layers.map(({ thickness, flags, angle, distance }, index) => ({
      thickness,
      flags,
      angle,
      gap: index === 0 ? 0 : distance - layers[index - 1].distance
    })),
    shell,
    randomness
  });

  const plateAt = (index: number) => {
    const { piece, plate, thickness, flags } = layers[index];
    const { angle, effective, overmatch, ricochet } = trace.layers[index];

    return { piece, plate, thickness, flags, angle, effective, overmatch, ricochet };
  };

  return {
    first: plateAt(0),
    main: trace.mainIndex >= 0 ? plateAt(trace.mainIndex) : undefined,
    total: trace.total,
    penetration: shell.penetration,
    chance: trace.chance,
    layerCount: trace.layers.filter(({ verdict }) => verdict !== 'hollow').length,
    verdict: trace.verdict
  };
};
