import type { Overlay } from '@otmetki/schemas';

import { overlayConfigSchema, overlayKindSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { KIND_PRESETS } from '../../../config';
import { toOverlayFormValues } from '../overlay-form';
import { overlayFormSchema } from '../overlay-form.schemas';

const PUBLIC_ID = 'a'.repeat(32);

const OVERLAY: Overlay = {
  id: '6f1c2b8e-8d4a-4a5e-9a37-3c2c1f0b9d11',
  name: 'Сессия',
  kind: 'moe',
  accountId: 1,
  config: overlayConfigSchema.parse({ metrics: ['moePercent'], theme: 'tracer', accentColor: '#00ff88' }),
  publicUrl: `https://otmetki.example/overlay/${PUBLIC_ID}`,
  isPaused: false,
  updatedAt: '2026-09-25T10:00:00.000Z'
};

describe('KIND_PRESETS', () => {
  it('gives every overlay kind a metric set the contract accepts', () => {
    overlayKindSchema.options.forEach((kind) => {
      expect(overlayConfigSchema.shape.metrics.safeParse([...KIND_PRESETS[kind]]).success).toBe(true);
    });
  });
});

describe('toOverlayFormValues', () => {
  it('starts a new overlay with values the form schema accepts', () => {
    expect(overlayFormSchema.safeParse(toOverlayFormValues({ overlay: null, locale: 'en', name: 'New' })).success).toBe(true);
  });

  it('starts a new overlay in the requested locale', () => {
    expect(toOverlayFormValues({ overlay: null, locale: 'en', name: 'New' }).config.locale).toBe('en');
  });

  it('keeps a saved overlay untouched', () => {
    const values = toOverlayFormValues({ overlay: OVERLAY, locale: 'ru', name: 'ignored' });

    expect(values).toEqual({ name: OVERLAY.name, kind: OVERLAY.kind, config: OVERLAY.config });
  });
});
