// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { cardSchema } from '../../model/schemas';
import { CardWidget } from '../CardWidget';

const data = cardSchema.parse(readWidgetFixture('card'));

describe(CardWidget, () => {
  it('draws the header, the chips, the rows and the footer of the Python card', () => {
    const html = mount({ Component: CardWidget, props: { data } });
    const text = html.textContent;

    expect(text).toContain('ЛБЗ');
    expect(text).toContain('EBR 105');
    expect(text).toContain('79.53%');
    expect(text).toContain('в работе');
    expect(text).toContain('Союз-4. Прорыв линии обороны');
    expect(text).toContain('Нанести 4000 урона');
    expect(text).toContain('ср. урон 2 781');
  });

  it('paints a rating colour and fills a progress bar', () => {
    const html = mount({ Component: CardWidget, props: { data } });
    const coloured = [...html.querySelectorAll('span')].find((span) => span.textContent === 'WN8 2 310');

    expect(coloured?.getAttribute('style')).toContain('color');
    expect(html.innerHTML).toContain('width: 72%');
  });

  it('draws the status marks as glyphs with explicit colours, never currentColor', () => {
    const html = mount({ Component: CardWidget, props: { data } });

    expect(html.querySelectorAll('svg').length).toBeGreaterThan(0);
    expect(html.innerHTML).not.toContain('currentColor');
  });

  it('keeps a card without a title to its body', () => {
    const html = mount({ Component: CardWidget, props: { data: { ...data, title: null, value: null, chips: [] } } });

    expect(html.textContent).not.toContain('ЛБЗ');
    expect(html.textContent).toContain('Союз-4');
  });
});
