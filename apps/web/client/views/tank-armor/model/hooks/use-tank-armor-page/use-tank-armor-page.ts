'use client';

import { USAGE_METERS } from '@otmetki/schemas';
import { useFormatter } from 'next-intl';

import { useArmorModel } from '@/entities/armor/armor-model';
import { useUsageMeter } from '@/entities/plus/usage';
import { isPlusRequiredError } from '@/shared/api/source';
import { useIsCrawler, useRouteParam } from '@/shared/lib';

import { ARMOR_QUOTA } from '../../../config';

export const useTankArmorPage = () => {
  const format = useFormatter();
  const slug = useRouteParam('slug');
  const isCrawler = useIsCrawler();
  const query = useArmorModel({ idOrSlug: slug, enabled: isCrawler === false });
  const quota = useUsageMeter({ meter: ARMOR_QUOTA.meter, enabled: isCrawler === false && query.fetchStatus === 'idle' });

  const isLimited = isPlusRequiredError(query.error);

  return {
    slug,
    query,
    isCrawler: isCrawler === true,
    isLimited,
    quota: {
      isVisible: !isLimited && !quota.isPending && !quota.isUnlimited && quota.limit !== null,
      audience: quota.audience ?? 'anonymous',
      remaining: quota.remaining ?? 0,
      limit: quota.limit ?? 0,
      freeLimit: USAGE_METERS[ARMOR_QUOTA.meter].free,
      resetsOn: quota.resetsAt ? format.dateTime(new Date(quota.resetsAt), ARMOR_QUOTA.resetFormat) : ''
    }
  };
};
