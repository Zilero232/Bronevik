import { describe, expect, it } from 'vitest';

import type { Guide } from '@/entities/guide/guide';

import { toGuideFormValues, toGuideInput, toGuideUpdateInput } from '../guide-form';
import { guideFormSchema } from '../guide-form.schemas';

const BODY = 'Stay behind the ridge, wait for spotting and trade damage only when the enemy reloads.';

const GUIDE: Guide = {
  id: '00000000-0000-4000-8000-000000000001',
  slug: 'ridge-play-a1b2c3',
  kind: 'map',
  tankId: null,
  arenaId: 'himmelsdorf',
  locale: 'en',
  title: 'Ridge play',
  body: BODY,
  status: 'published',
  likesCount: 3,
  likedByMe: false,
  author: { id: '00000000-0000-4000-8000-000000000002', name: 'Tanker', image: null },
  publishedAt: '2026-09-20T10:00:00.000Z',
  createdAt: '2026-09-19T10:00:00.000Z',
  updatedAt: '2026-09-20T10:00:00.000Z'
};

describe('guideFormSchema', () => {
  it('trims the title and body before checking their length', () => {
    const parsed = guideFormSchema.parse({ kind: 'general', locale: 'ru', title: '  Hull down  ', body: `  ${BODY}  ` });

    expect(parsed.title).toBe('Hull down');
    expect(parsed.body).toBe(BODY);
  });

  it('rejects a title that is only long enough with spaces', () => {
    expect(guideFormSchema.safeParse({ kind: 'general', locale: 'ru', title: ' ab    ', body: BODY }).success).toBe(false);
  });

  it('requires a tank for a tank guide', () => {
    const result = guideFormSchema.safeParse({ kind: 'tank', locale: 'ru', title: 'Hull down', body: BODY });

    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toContain('tankId');
  });

  it('requires a map for a map guide', () => {
    const result = guideFormSchema.safeParse({ kind: 'map', locale: 'ru', title: 'Hull down', body: BODY });

    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toContain('arenaId');
  });

  it('accepts a general guide without a tank or map', () => {
    expect(guideFormSchema.safeParse({ kind: 'general', locale: 'en', title: 'Hull down', body: BODY }).success).toBe(true);
  });
});

describe('toGuideFormValues', () => {
  it('starts a new guide in the page language', () => {
    expect(toGuideFormValues({ guide: null, locale: 'en' })).toMatchObject({ kind: 'general', locale: 'en', title: '', body: '' });
  });

  it('falls back to Russian for an unknown locale', () => {
    expect(toGuideFormValues({ guide: null, locale: 'de' }).locale).toBe('ru');
  });

  it('turns null subject ids of a saved guide into empty fields', () => {
    const values = toGuideFormValues({ guide: GUIDE, locale: 'ru' });

    expect(values).toMatchObject({ kind: 'map', arenaId: 'himmelsdorf', locale: 'en', title: 'Ridge play' });
    expect(values.tankId).toBeUndefined();
  });
});

describe('toGuideInput', () => {
  it('sends only the subject that matches the kind', () => {
    const input = toGuideInput({ kind: 'tank', tankId: 1, arenaId: 'himmelsdorf', locale: 'ru', title: 'Hull down', body: BODY });

    expect(input.tankId).toBe(1);
    expect(input).not.toHaveProperty('arenaId');
  });

  it('drops both subjects for a general guide', () => {
    const input = toGuideInput({ kind: 'general', tankId: 1, arenaId: 'himmelsdorf', locale: 'ru', title: 'Hull down', body: BODY });

    expect(input).not.toHaveProperty('tankId');
    expect(input).not.toHaveProperty('arenaId');
  });
});

describe('toGuideUpdateInput', () => {
  it('sends null for the subject the kind does not use, so a PATCH clears it', () => {
    expect(toGuideUpdateInput({ kind: 'general', tankId: 1, arenaId: 'himmelsdorf', locale: 'ru', title: 'Hull down', body: BODY })).toMatchObject({
      tankId: null,
      arenaId: null
    });
  });

  it('keeps the subject of the chosen kind', () => {
    const input = toGuideUpdateInput({ kind: 'tank', tankId: 1, arenaId: 'himmelsdorf', locale: 'en', title: 'Hull down', body: BODY });

    expect(input).toEqual({ kind: 'tank', locale: 'en', title: 'Hull down', body: BODY, tankId: 1, arenaId: null });
  });

  it('clears a map the author removed', () => {
    expect(
      toGuideUpdateInput({ kind: 'map', tankId: undefined, arenaId: undefined, locale: 'ru', title: 'Hull down', body: BODY }).arenaId
    ).toBeNull();
  });
});
