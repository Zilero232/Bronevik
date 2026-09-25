import {
  bindCodeSchema,
  createFavoriteSchema,
  createGoalSchema,
  favoriteSchema,
  favoritesSchema,
  goalSchema,
  goalsSchema,
  linkedAccountsSchema,
  modDevicesSchema,
  notificationSettingsSchema
} from '@bronevik/schemas';
import { addDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { mockMe } from '../me.mock';

const ACCOUNT_ID = mockMe.accounts().lesta[0]?.accountId ?? 1;

describe('me mocks', () => {
  it('answer every read endpoint in the shape the API contract promises', () => {
    expect(() => favoritesSchema.parse(mockMe.favorites())).not.toThrow();
    expect(() => goalsSchema.parse(mockMe.goals())).not.toThrow();
    expect(() => notificationSettingsSchema.parse(mockMe.notifications())).not.toThrow();
    expect(() => linkedAccountsSchema.parse(mockMe.accounts())).not.toThrow();
    expect(() => bindCodeSchema.parse(mockMe.bindCode())).not.toThrow();
    expect(() => modDevicesSchema.parse(mockMe.devices())).not.toThrow();
  });

  it('answer a created favorite and goal in the contract shape', () => {
    const favorite = mockMe.addFavorite(createFavoriteSchema.parse({ kind: 'clan', targetId: 1 }));
    const goal = mockMe.addGoal(
      createGoalSchema.parse({ accountId: ACCOUNT_ID, metric: 'moe', target: 90, endsAt: addDays(new Date(), 7).toISOString() })
    );

    expect(() => favoriteSchema.parse(favorite)).not.toThrow();
    expect(() => goalSchema.parse(goal)).not.toThrow();

    mockMe.removeFavorite(favorite.id);
    mockMe.removeGoal(goal.id);
  });

  it('keep every percent goal inside the percent range', () => {
    mockMe
      .goals()
      .filter(({ metric }) => metric === 'winRate' || metric === 'moe')
      .forEach(({ target, baseline, current }) => {
        [target, baseline, current ?? 0].forEach((value) => {
          expect(value).toBeGreaterThan(1);
          expect(value).toBeLessThanOrEqual(100);
        });
      });
  });

  it('keep a single primary Lesta account', () => {
    expect(mockMe.accounts().lesta.filter(({ isPrimary }) => isPrimary)).toHaveLength(1);
  });
});
