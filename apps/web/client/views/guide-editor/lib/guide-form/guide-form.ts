import type { CreateGuide, UpdateGuide } from '@/entities/guide/guide';

import type { GuideFormLocale, GuideFormOutput, GuideFormValues, ToGuideFormValuesInput } from './guide-form.types';

import { GUIDE_FORM_DEFAULT_VALUES } from '../../config';

const guideLocaleOf = (locale: string): GuideFormLocale => (locale === 'en' ? 'en' : 'ru');

export const toGuideFormValues = ({ guide, locale }: ToGuideFormValuesInput): GuideFormValues =>
  guide
    ? {
        kind: guide.kind,
        tankId: guide.tankId ?? undefined,
        arenaId: guide.arenaId ?? undefined,
        locale: guideLocaleOf(guide.locale),
        title: guide.title,
        body: guide.body
      }
    : { ...GUIDE_FORM_DEFAULT_VALUES, locale: guideLocaleOf(locale) };

export const toGuideInput = ({ kind, tankId, arenaId, locale, title, body }: GuideFormOutput): CreateGuide => ({
  kind,
  locale,
  title,
  body,
  ...(kind === 'tank' && tankId !== undefined ? { tankId } : {}),
  ...(kind === 'map' && arenaId !== undefined ? { arenaId } : {})
});

export const toGuideUpdateInput = ({ kind, tankId, arenaId, locale, title, body }: GuideFormOutput): UpdateGuide => ({
  kind,
  locale,
  title,
  body,
  tankId: kind === 'tank' ? (tankId ?? null) : null,
  arenaId: kind === 'map' ? (arenaId ?? null) : null
});
