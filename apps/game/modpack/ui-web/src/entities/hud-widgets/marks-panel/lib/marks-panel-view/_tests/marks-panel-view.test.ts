import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { marksPanelSchema } from '../../../model/schemas';
import { marksPanelView } from '../marks-panel-view';

const data = marksPanelSchema.parse(readWidgetFixture('marks_panel'));

describe(marksPanelView, () => {
  it('writes the percent the way the HUD formats numbers', () => {
    const view = marksPanelView(data);

    expect(view.percent).toBe('86,30 %');
  });

  it('signs the change and tones a gain as good', () => {
    const view = marksPanelView(data);

    expect(view.delta).toBe('+0,18 %');
    expect(view.deltaTone).toBe('good');
  });

  it('writes the damage left only for the thresholds not yet reached', () => {
    const view = marksPanelView(data);

    expect(view.thresholds.map((item) => item.value)).toEqual(['', '', '25 195']);
  });

  it('writes the damage for the next half-percent step', () => {
    const view = marksPanelView(data);

    expect(view.step).toBe('+0,5 %: 955');
  });

  it('keeps the minimal style to the percent', () => {
    const view = marksPanelView({ ...data, style: 'minimal' });

    expect(view.delta).toBeNull();
    expect(view.up).toBeNull();
  });

  it('writes a dash for an unknown percent', () => {
    const view = marksPanelView({ ...data, percent: null, mark: null });

    expect(view.percent).toBe('—');
  });

  it('writes the damage for the next whole percent', () => {
    const view = marksPanelView(data);

    expect(view.up).toEqual({ label: '87 %', value: '2 107', reached: false });
  });

  it('marks the next whole percent reached when no damage is left', () => {
    const view = marksPanelView({ ...data, up: { level: 87, need: 0 } });

    expect(view.up).toEqual({ label: '87 %', value: '', reached: true });
  });

  it('tones a verified starting percent as success', () => {
    const view = marksPanelView(data);

    expect(view.source).toEqual({ label: 'проверено', tone: 'success' });
  });

  it('tones an estimated starting percent as a warning', () => {
    const view = marksPanelView({ ...data, source: { kind: 'estimated', label: 'оценка' } });

    expect(view.source).toEqual({ label: 'оценка', tone: 'warning' });
  });

  it('writes the average and the mark target in the extended Alt view', () => {
    const view = marksPanelView(data);

    expect(view.detail).toEqual({ label: 'среднее', average: '2 540 › 2 551', target: '95 %: 3 050' });
  });

  it('leaves the Alt detail out of the compact style', () => {
    const view = marksPanelView({ ...data, style: 'compact' });

    expect(view.detail).toBeNull();
  });
});
