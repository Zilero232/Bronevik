// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { battleClockSchema } from '../../model/schemas';
import { BattleClockWidget } from '../BattleClockWidget';

const data = battleClockSchema.parse(readWidgetFixture('battle_clock'));

describe(BattleClockWidget, () => {
  it('shows the local time under the stock timer and the battle timer beside it', () => {
    const html = render(<BattleClockWidget data={data} />).container;

    expect(html.textContent).toBe('21:4707:00');
  });

  it('puts the timer in front when it replaces the stock one', () => {
    const html = render(<BattleClockWidget data={{ ...data, big_timer: true }} />).container;

    expect(html.textContent).toBe('07:0021:47');
  });
});
