'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { sortBy } from 'remeda';
import { toast } from 'sonner';

import type { CreateGuide, Guide } from '@/shared/api/guides';

import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { createGuide, updateGuide } from '@/shared/api/guides';
import { listMaps } from '@/shared/api/maps';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import type { GuideFormOutput, GuideFormValues } from '../../../lib/guide-form';

import { GUIDE_FORM, GUIDE_FORM_KINDS, GUIDE_FORM_LOCALES } from '../../../config';
import { guideFormSchema, toGuideFormValues, toGuideInput } from '../../../lib/guide-form';

export const useGuideEditorForm = (guide: Guide | null) => {
  const t = useTranslations('guides');
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: catalog } = useVehicleCatalog();
  const form = useForm<GuideFormValues, unknown, GuideFormOutput>({
    resolver: zodResolver(guideFormSchema),
    defaultValues: toGuideFormValues({ guide, locale })
  });

  const [kind, tankId, arenaId, title] = useWatch({ control: form.control, name: ['kind', 'tankId', 'arenaId', 'title'] });

  const { data: maps } = useQuery({
    queryKey: QUERY_KEYS.maps.list,
    queryFn: ({ signal }) => listMaps({ signal }),
    enabled: kind === 'map'
  });

  const save = useMutation({
    mutationFn: (input: CreateGuide) => (guide ? updateGuide({ id: guide.id, body: input }) : createGuide(input)),
    onSuccess: (saved) => {
      toast.success(guide ? t('editor.updated') : t('editor.created'));
      queryClient.setQueryData(QUERY_KEYS.guides.detail(saved.slug), saved);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.guides.all, refetchType: 'none' });
      router.push(ROUTES.guide(saved.slug));
    },
    onError: () => toast.error(t('editor.failed'))
  });

  const onSubmit = form.handleSubmit((values) => save.mutate(toGuideInput(values)));

  return {
    form,
    isEdit: guide !== null,
    kind,
    kindOptions: GUIDE_FORM_KINDS.map((value) => ({ value, label: t(`kinds.${value}`) })),
    localeOptions: GUIDE_FORM_LOCALES.map((value) => ({ value, label: t(`locales.${value}`) })),
    tank: tankId === undefined ? null : (vehicleIndex(catalog)[tankId] ?? null),
    onTankChange: (vehicle: VehicleSummary | null) =>
      form.setValue('tankId', vehicle?.tankId, { shouldDirty: true, shouldValidate: form.formState.isSubmitted }),
    map: arenaId ?? GUIDE_FORM.noMap,
    mapItems: [
      { value: GUIDE_FORM.noMap, label: t('editor.mapPlaceholder') },
      ...sortBy(maps ?? [], (map) => map.name).map((map) => ({ value: map.arenaId, label: map.name }))
    ],
    onMapChange: (value: string) =>
      form.setValue('arenaId', value === GUIDE_FORM.noMap ? undefined : value, {
        shouldDirty: true,
        shouldValidate: form.formState.isSubmitted
      }),
    titleLength: title.length,
    titleMax: GUIDE_FORM.titleMax,
    isPending: save.isPending,
    onSubmit
  };
};
