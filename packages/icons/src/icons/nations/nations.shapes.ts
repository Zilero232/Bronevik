import { round } from 'remeda';

import type { Nation } from '../../registry';
import type { FlagLayer, RectInput } from '../icons.types';

import { starPath } from '../../lib';

const FIELD = { x: 2, y: 5, width: 20, height: 14 } as const;

const rect = ({ x, y, width, height }: RectInput) => `M${x} ${y}h${width}v${height}h${-width}Z`;

const third = FIELD.width / 3;

const half = FIELD.height / 2;

const full = rect({ x: FIELD.x, y: FIELD.y, width: FIELD.width, height: FIELD.height });

const diagonal = (halfWidth: number) => {
  const along = (halfWidth * Math.hypot(FIELD.width, FIELD.height)) / FIELD.height;
  const down = (halfWidth * Math.hypot(FIELD.width, FIELD.height)) / FIELD.width;
  const [left, top, right, bottom] = [FIELD.x, FIELD.y, FIELD.x + FIELD.width, FIELD.y + FIELD.height];
  const fixed = (value: number) => round(value, 2);

  return [
    `M${left} ${top}L${fixed(left + along)} ${top}L${right} ${fixed(bottom - down)}L${right} ${bottom}L${fixed(right - along)} ${bottom}L${left} ${fixed(top + down)}Z`,
    `M${right} ${top}L${fixed(right - along)} ${top}L${left} ${fixed(bottom - down)}L${left} ${bottom}L${fixed(left + along)} ${bottom}L${right} ${fixed(top + down)}Z`
  ].join('');
};

const PAPER = '#f1ede2';

const US_STAR = starPath({ cx: 6.5, cy: 8.6, outer: 2.3, inner: 0.95 });

export const FLAG_FRAME = 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z';

export const FLAG_VIEWBOX = `${FIELD.x} ${FIELD.y} ${FIELD.width} ${FIELD.height}`;

export const NATION_FLAGS = {
  ussr: [
    { d: full, color: '#b3262a', mono: 0.22 },
    { d: starPath({ cx: 7.4, cy: 10.3, outer: 3.6, inner: 1.5 }), color: '#f2c14e', mono: 1, strokeWidth: 0.9 }
  ],
  germany: [
    { d: rect({ x: FIELD.x, y: FIELD.y, width: FIELD.width, height: FIELD.height / 3 }), color: '#26272b', mono: 1 },
    { d: rect({ x: FIELD.x, y: FIELD.y + FIELD.height / 3, width: FIELD.width, height: FIELD.height / 3 }), color: '#cf3a2e', mono: 0.55 },
    { d: rect({ x: FIELD.x, y: FIELD.y + (FIELD.height * 2) / 3, width: FIELD.width, height: FIELD.height / 3 }), color: '#f0c330', mono: 0.2 }
  ],
  usa: [
    { d: full, color: PAPER, mono: 0 },
    { d: [5, 9, 13, 17].map((y) => rect({ x: FIELD.x, y, width: FIELD.width, height: 2 })).join(''), color: '#b83a34', mono: 0.45 },
    { d: `${rect({ x: FIELD.x, y: FIELD.y, width: 9, height: 7 })}${US_STAR}`, color: '#2c4786', mono: 1, evenOdd: true },
    { d: US_STAR, color: PAPER, mono: 0 }
  ],
  china: [
    { d: full, color: '#d0342c', mono: 0.22 },
    {
      d: [
        starPath({ cx: 6.2, cy: 9.3, outer: 2.7, inner: 1.1 }),
        starPath({ cx: 9.9, cy: 6.6, outer: 0.85 }),
        starPath({ cx: 11.1, cy: 8.4, outer: 0.85 }),
        starPath({ cx: 11.1, cy: 10.6, outer: 0.85 }),
        starPath({ cx: 9.9, cy: 12.3, outer: 0.85 })
      ].join(''),
      color: '#f5c842',
      mono: 1
    }
  ],
  france: [
    { d: rect({ x: FIELD.x, y: FIELD.y, width: third, height: FIELD.height }), color: '#2b4c9b', mono: 1 },
    { d: rect({ x: FIELD.x + third, y: FIELD.y, width: third, height: FIELD.height }), color: PAPER, mono: 0 },
    { d: rect({ x: FIELD.x + third * 2, y: FIELD.y, width: third, height: FIELD.height }), color: '#d5403a', mono: 0.45 }
  ],
  uk: [
    { d: full, color: '#24407e', mono: 0.22 },
    { d: diagonal(1.6), color: PAPER, mono: 0 },
    { d: diagonal(0.6), color: '#c8313a', mono: 1 },
    {
      d: `${rect({ x: 10.2, y: FIELD.y, width: 3.6, height: FIELD.height })}${rect({ x: FIELD.x, y: 10.2, width: FIELD.width, height: 3.6 })}`,
      color: PAPER,
      mono: 0
    },
    {
      d: `${rect({ x: 11, y: FIELD.y, width: 2, height: FIELD.height })}${rect({ x: FIELD.x, y: 11, width: FIELD.width, height: 2 })}`,
      color: '#c8313a',
      mono: 1
    }
  ],
  japan: [
    { d: full, color: PAPER, mono: 0 },
    { d: 'M8.2 12a3.8 3.8 0 1 0 7.6 0a3.8 3.8 0 1 0-7.6 0Z', color: '#c8313a', mono: 1 }
  ],
  czech: [
    { d: rect({ x: FIELD.x, y: FIELD.y, width: FIELD.width, height: half }), color: PAPER, mono: 0 },
    { d: rect({ x: FIELD.x, y: FIELD.y + half, width: FIELD.width, height: half }), color: '#cc3a33', mono: 0.45 },
    { d: 'M2 5L12 12L2 19Z', color: '#2a4f8f', mono: 1 }
  ],
  sweden: [
    { d: full, color: '#2f6db3', mono: 0.22 },
    {
      d: `${rect({ x: 7.6, y: FIELD.y, width: 2.8, height: FIELD.height })}${rect({ x: FIELD.x, y: 10.6, width: FIELD.width, height: 2.8 })}`,
      color: '#f2c42e',
      mono: 1
    }
  ],
  poland: [
    { d: rect({ x: FIELD.x, y: FIELD.y, width: FIELD.width, height: half }), color: PAPER, mono: 0 },
    { d: rect({ x: FIELD.x, y: FIELD.y + half, width: FIELD.width, height: half }), color: '#d23a3f', mono: 1 }
  ],
  italy: [
    { d: rect({ x: FIELD.x, y: FIELD.y, width: third, height: FIELD.height }), color: '#2f8a55', mono: 1 },
    { d: rect({ x: FIELD.x + third, y: FIELD.y, width: third, height: FIELD.height }), color: PAPER, mono: 0 },
    { d: rect({ x: FIELD.x + third * 2, y: FIELD.y, width: third, height: FIELD.height }), color: '#cd3a3a', mono: 0.45 }
  ],
  intunion: [
    { d: full, color: '#35566f', mono: 0.22 },
    { d: 'M7.8 12a4.2 4.2 0 1 0 8.4 0a4.2 4.2 0 1 0-8.4 0Z', color: '#ece6d6', mono: 1, strokeWidth: 1 },
    { d: 'M12 7.8a1.9 4.2 0 1 0 0 8.4a1.9 4.2 0 1 0 0-8.4ZM7.8 12h8.4', color: '#ece6d6', mono: 1, strokeWidth: 0.8 }
  ]
} as const satisfies Record<Nation, FlagLayer[]>;
