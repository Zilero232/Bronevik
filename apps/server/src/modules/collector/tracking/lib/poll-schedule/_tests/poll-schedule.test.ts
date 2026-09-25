import { describe, expect, it } from 'vitest';

import { nextPollAt } from '../poll-schedule';

const now = new Date('2026-09-24T12:00:00Z');
const intervals = { activeMinutes: 15, subscriberMinutes: 5, populationHours: 24, dormantDays: 7 };

const delay = (at: Date) => at.getTime() - now.getTime();

describe('nextPollAt', () => {
  it('polls a subscriber sooner than a regular tracked account', () => {
    const subscriber = nextPollAt({ now, tier: 'active', isSubscriber: true, intervals });
    const regular = nextPollAt({ now, tier: 'active', isSubscriber: false, intervals });

    expect(delay(subscriber)).toBeLessThan(delay(regular));
  });

  it('orders the tiers active < population < dormant', () => {
    const [active, population, dormant] = (['active', 'population', 'dormant'] as const).map((tier) =>
      delay(nextPollAt({ now, tier, isSubscriber: false, intervals }))
    );

    expect(active).toBeLessThan(population ?? 0);
    expect(population).toBeLessThan(dormant ?? 0);
  });
});
