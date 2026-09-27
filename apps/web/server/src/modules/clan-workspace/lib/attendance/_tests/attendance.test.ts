import { describe, expect, it } from 'vitest';

import { attendedAccounts } from '../attendance';

const skirmish = 20;
const advance = 21;

describe('attendedAccounts', () => {
  it('marks a member present when one of their battles in the window was of the event type', () => {
    const result = attendedAccounts({
      battles: [
        { accountId: 1n, battleType: '1' },
        { accountId: 1n, battleType: String(advance) }
      ],
      bonusTypes: [skirmish, advance]
    });

    expect(result.get(1n)).toBe(true);
  });

  it('marks a member absent when they fought only other battles during the event', () => {
    const result = attendedAccounts({ battles: [{ accountId: 2n, battleType: '1' }], bonusTypes: [skirmish] });

    expect(result.get(2n)).toBe(false);
  });

  it('says nothing about a member who reported no battles in the window', () => {
    const result = attendedAccounts({ battles: [{ accountId: 1n, battleType: String(skirmish) }], bonusTypes: [skirmish] });

    expect(result.has(3n)).toBe(false);
  });
});
