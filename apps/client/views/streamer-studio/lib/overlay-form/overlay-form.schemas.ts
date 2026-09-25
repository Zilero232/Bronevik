import { overlayConfigSchema, overlayKindSchema } from '@bronevik/schemas';
import { z } from 'zod';

import { OVERLAY_EDITOR } from '../../config';

const { theme, layout, metrics, accentColor, fontScale, animate, showTank, resetAt, locale } = overlayConfigSchema.shape;

export const overlayFormSchema = z.object({
  name: z.string().trim().min(1).max(OVERLAY_EDITOR.nameMax),
  kind: overlayKindSchema,
  config: z.object({
    theme: theme.unwrap(),
    layout: layout.unwrap(),
    metrics,
    accentColor,
    fontScale: fontScale.unwrap(),
    animate: animate.unwrap(),
    showTank: showTank.unwrap(),
    resetAt: resetAt.unwrap(),
    locale: locale.unwrap()
  })
});
