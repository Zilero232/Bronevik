import { activateChallengeSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { activateFormSchema } from '../activate-form.schemas';

describe('activateFormSchema', () => {
  it('sends no donor when the field is left blank or only spaces', () => {
    expect(activateFormSchema.parse({ donorName: '   ' }).donorName).toBeUndefined();
  });

  it('produces a body the activate contract accepts', () => {
    const output = activateFormSchema.parse({ donorName: ' viewer ' });

    expect(activateChallengeSchema.parse(output)).toEqual(output);
  });

  it('refuses a donor name longer than the contract allows', () => {
    const tooLong = 'x'.repeat(200);

    expect(activateChallengeSchema.safeParse({ donorName: tooLong }).success).toBe(false);
    expect(activateFormSchema.safeParse({ donorName: tooLong }).success).toBe(false);
  });
});
