import { describe, expect, it } from 'vitest';

import { updateBuildSchema } from '../community-builds.schemas';

describe('updateBuildSchema', () => {
  it('leaves visibility unset when the edit only renames the build', () => {
    expect(updateBuildSchema.parse({ title: 'Renamed build' })).toEqual({ title: 'Renamed build' });
  });
});
