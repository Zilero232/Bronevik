// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import type { ReportRow } from '../../../../../../lib/marks-report';

import { mount } from '../../../../../../../../shared/lib/testing/mount';
import { toneClass } from '../../../../../../../../shared/ui/hud';
import { ReportTable } from '../ReportTable';

import s from '../ReportTable.module.scss';

const GAINED: ReportRow = { key: 'b1', date: '12.09 21:40', damage: '4 500', percent: '85,20 %', delta: '+0,40 %', tone: 'good' };

const deltaCell = (html: HTMLElement): Element | undefined => [...html.querySelectorAll('span')].find((span) => span.textContent === GAINED.delta);

describe(ReportTable, () => {
  it('colours the delta cell by its tone', () => {
    const html = mount({ Component: ReportTable, props: { rows: [GAINED] } });

    const cell = deltaCell(html);

    expect(cell?.classList.contains(toneClass('good') ?? '')).toBe(true);
  });

  it('keeps the plain text colour off the delta cell so the tone is not overridden', () => {
    const html = mount({ Component: ReportTable, props: { rows: [GAINED] } });

    const cell = deltaCell(html);

    expect(cell?.classList.contains(s.value ?? '')).toBe(false);
  });
});
