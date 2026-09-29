// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { battleClockSchema } from '../../model/schemas';
import { BattleClockWidget } from '../BattleClockWidget';

const data = battleClockSchema.parse(readWidgetFixture('battle_clock'));

describe(BattleClockWidget, () => {
  it('shows the local time under the stock timer and the battle timer beside it', () => {
    expect(mount({ Component: BattleClockWidget, props: { data } }).textContent).toBe('21:4707:00');
  });

  it('puts the timer in front when it replaces the stock one', () => {
    expect(mount({ Component: BattleClockWidget, props: { data: { ...data, big_timer: true } } }).textContent).toBe('07:0021:47');
  });
});
