import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NATIONS, TANK_CLASSES } from '../../registry';
import { TankClassIcon } from '../classes/classes';
import { CLASS_GLYPHS, CLASS_VARIANT } from '../classes/classes.shapes';
import { MarkOfExcellenceIcon } from '../marks/marks';
import { MasteryIcon } from '../mastery/mastery';
import { MASTERY_TINTS } from '../mastery/mastery.shapes';
import { NationFlag, NationIcon } from '../nations/nations';
import { NATION_FLAGS } from '../nations/nations.shapes';
import { TierIcon } from '../tier/tier';

const svgOf = (container: HTMLElement) => container.querySelector('svg');

const pathsOf = (container: HTMLElement) => [...(svgOf(container)?.querySelectorAll('path') ?? [])];

describe('TankClassIcon', () => {
  it('cuts light, medium and heavy out of one rhombus into one, two and three pieces', () => {
    expect(CLASS_GLYPHS.lightTank).toHaveLength(1);
    expect(CLASS_GLYPHS.mediumTank).toHaveLength(2);
    expect(CLASS_GLYPHS.heavyTank).toHaveLength(3);
  });

  it('draws the regular glyph as a solid shape in the current colour', () => {
    TANK_CLASSES.forEach((tankClass) => {
      const { container, unmount } = render(<TankClassIcon tankClass={tankClass} />);
      const glyph = svgOf(container)?.querySelector('g');

      expect(glyph?.getAttribute('fill')).toBe('currentColor');
      expect(glyph?.querySelectorAll('path')).toHaveLength(CLASS_GLYPHS[tankClass].length);

      unmount();
    });
  });

  it('paints the premium glyph gold with a glow', () => {
    const { container } = render(<TankClassIcon tankClass='heavyTank' variant='premium' />);
    const glyph = svgOf(container)?.querySelector('g');

    expect(glyph?.getAttribute('fill')).toBe(CLASS_VARIANT.premiumFill);
    expect(glyph?.getAttribute('style')).toContain('drop-shadow');
  });

  it('wraps the elite glyph in a laurel and shrinks the glyph inside it', () => {
    const { container } = render(<TankClassIcon tankClass='mediumTank' variant='elite' />);
    const { left, right } = CLASS_VARIANT.laurel;
    const laurel = left.leaves.length + right.leaves.length + 2;

    expect(svgOf(container)?.getAttribute('data-variant')).toBe('elite');
    expect(svgOf(container)?.querySelector('g[transform]')?.querySelectorAll('path')).toHaveLength(CLASS_GLYPHS.mediumTank.length);
    expect(pathsOf(container)).toHaveLength(laurel + CLASS_GLYPHS.mediumTank.length);
  });
});

describe('NationIcon', () => {
  it('paints every flag layer in colour mode', () => {
    NATIONS.forEach((nation) => {
      const { container, unmount } = render(<NationIcon nation={nation} palette='color' />);
      const paints = pathsOf(container).flatMap((path) => [path.getAttribute('fill'), path.getAttribute('stroke')]);

      NATION_FLAGS[nation].forEach(({ color }) => expect(paints).toContain(color));

      unmount();
    });
  });

  it('uses only the current colour in mono mode and skips blank layers', () => {
    NATIONS.forEach((nation) => {
      const { container, unmount } = render(<NationIcon nation={nation} />);
      const layers = pathsOf(container).slice(0, -1);

      expect(layers).toHaveLength(NATION_FLAGS[nation].filter(({ mono }) => mono > 0).length);
      layers.forEach((path) => expect([path.getAttribute('fill'), path.getAttribute('stroke')]).toContain('currentColor'));

      unmount();
    });
  });

  it('draws the backdrop flag without a frame', () => {
    const { container } = render(<NationFlag nation='sweden' />);

    expect(pathsOf(container)).toHaveLength(NATION_FLAGS.sweden.length);
  });
});

describe('MasteryIcon', () => {
  it('keeps the current colour unless tinted', () => {
    const { container } = render(<MasteryIcon level='first' />);

    expect(svgOf(container)?.getAttribute('stroke')).toBe('currentColor');
  });

  it('tints each level with its own metal', () => {
    (['third', 'second', 'first', 'master'] as const).forEach((level) => {
      const { container, unmount } = render(<MasteryIcon tinted level={level} />);

      expect(svgOf(container)?.getAttribute('stroke')).toBe(MASTERY_TINTS[level]);

      unmount();
    });
  });

  it('adds a glow only to the tinted master badge', () => {
    const master = render(<MasteryIcon tinted level='master' />);
    const first = render(<MasteryIcon tinted level='first' />);

    expect(svgOf(master.container)?.getAttribute('style')).toContain('drop-shadow');
    expect(svgOf(first.container)?.getAttribute('style')).toBeNull();
  });
});

describe('MarkOfExcellenceIcon', () => {
  it('draws one ring per mark and no stars in the ring style', () => {
    ([1, 2, 3] as const).forEach((marks) => {
      const { container, unmount } = render(<MarkOfExcellenceIcon marks={marks} markStyle='rings' />);

      expect(svgOf(container)?.getAttribute('data-style')).toBe('rings');
      expect(pathsOf(container)).toHaveLength(2 + marks);

      unmount();
    });
  });

  it('draws a stripe and a star per mark in the star style', () => {
    const { container } = render(<MarkOfExcellenceIcon marks={2} />);

    expect(pathsOf(container)).toHaveLength(2 + 2 * 2);
  });
});

describe('TierIcon', () => {
  it('sets the numeral on an engraved plate', () => {
    const { container } = render(<TierIcon engraved tier={11} />);

    expect(svgOf(container)?.hasAttribute('data-engraved')).toBe(true);
    expect(svgOf(container)?.querySelector('title')?.textContent).toBe('XI');
  });
});
