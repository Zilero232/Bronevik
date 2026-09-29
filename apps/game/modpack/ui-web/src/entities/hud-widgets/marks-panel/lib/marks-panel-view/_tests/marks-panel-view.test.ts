import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { marksPanelSchema } from '../../../model/schemas';
import { marksPanelView } from '../marks-panel-view';

const data = marksPanelSchema.parse(readWidgetFixture('marks_panel'));

describe(marksPanelView, () => {
  it('writes the percent, the signed change and the thresholds the way the HUD formats numbers', () => {
    const view = marksPanelView(data);

    expect(view.percent).toBe('86,30 %');
    expect(view.delta).toBe('▲ +0,18 %');
    expect(view.deltaTone).toBe('good');
    expect(view.thresholds.map((item) => item.value)).toEqual(['✓', '✓', '25 195']);
    expect(view.step).toBe('+0,5 %: 955');
  });

  it('keeps the minimal style to the percent', () => {
    expect(marksPanelView({ ...data, style: 'minimal' }).delta).toBeNull();
    expect(marksPanelView({ ...data, percent: null, mark: null }).percent).toBe('—');
  });
});
