import { overlaySchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { mockStreamers } from '../mock/streamers.mock';
import {
  challengeListSchema,
  connectUrlSchema,
  integrationListSchema,
  overlayDataSchema,
  overlayListSchema,
  overlayPublicIdSchema,
  streamerChallengeSchema,
  streamerProfileSchema
} from '../streamers.schemas';

describe('mockStreamers', () => {
  it('serves profile, overlays, challenges and integrations that match the contract', () => {
    expect(() => streamerProfileSchema.parse(mockStreamers.profile())).not.toThrow();
    expect(() => overlayListSchema.parse(mockStreamers.overlays())).not.toThrow();
    expect(() => challengeListSchema.parse(mockStreamers.challenges())).not.toThrow();
    expect(() => integrationListSchema.parse(mockStreamers.integrations())).not.toThrow();
    expect(() => connectUrlSchema.parse(mockStreamers.connectUrl('twitch'))).not.toThrow();
  });

  it('publishes overlays under a valid public id', () => {
    mockStreamers.overlays().forEach(({ publicUrl }) => expect(overlayPublicIdSchema.safeParse(publicUrl.split('/').at(-1)).success).toBe(true));
  });

  it('fills the config defaults of a created overlay', () => {
    const overlay = overlaySchema.parse(mockStreamers.createOverlay({ name: 'Test', kind: 'wn8', config: { metrics: ['wn8'] } }));

    expect(overlay.config.theme).toBeDefined();
  });

  it('serves overlay data for any public id', () => {
    expect(() => overlayDataSchema.parse(mockStreamers.overlayData('0'.repeat(32)))).not.toThrow();
  });

  it('moves a challenge from pending to active and to cancelled', () => {
    const created = streamerChallengeSchema.parse(
      mockStreamers.createChallenge({
        title: 'Test run',
        condition: { metric: 'damage', operator: 'gte', value: 3_000, battles: 1, aggregate: 'single' },
        amount: 100,
        expiresInMinutes: 60
      })
    );

    expect(created.status).toBe('pending');
    expect(mockStreamers.activateChallenge({ id: created.id }).status).toBe('active');
    expect(mockStreamers.cancelChallenge(created.id).status).toBe('cancelled');
  });
});
