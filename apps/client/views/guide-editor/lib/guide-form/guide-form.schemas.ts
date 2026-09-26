import { z } from 'zod';

import { zCreateGuide, zUpdateGuide } from '@/shared/api/guides';

export const guideFormSchema = zCreateGuide
  .extend({
    locale: zUpdateGuide.shape.locale.unwrap(),
    title: z.string().trim().pipe(zCreateGuide.shape.title),
    body: z.string().trim().pipe(zCreateGuide.shape.body)
  })
  .superRefine((values, context) => {
    if (values.kind === 'tank' && values.tankId === undefined) {
      context.addIssue({ code: 'custom', path: ['tankId'], message: 'tankRequired' });
    }

    if (values.kind === 'map' && values.arenaId === undefined) {
      context.addIssue({ code: 'custom', path: ['arenaId'], message: 'mapRequired' });
    }
  });
