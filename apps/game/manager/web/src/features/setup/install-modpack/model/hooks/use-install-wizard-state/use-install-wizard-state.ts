import { useMutation, useQueryClient } from '@tanstack/react-query';
import { open } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'use-intl';

import { previewSrc } from '@/entities/catalog';
import { useSelectedClient } from '@/entities/client';
import { installModpack, readInstallerProfile, useInstallPlan } from '@/entities/setup';
import { QUERY_KEYS } from '@/shared/config';
import { pickLocalized, useErrorToast, useNavigation } from '@/shared/lib';

import type { Selection } from '../../../lib';
import type { ToggleInput, UseInstallWizardStateInput } from './use-install-wizard-state.types';

import { INSTALL_WIZARD } from '../../../config';
import { closeDependencies, matchingPreset, presetSelection, toggleSelection } from '../../../lib';

export const useInstallWizardState = ({ initialPreset }: UseInstallWizardStateInput) => {
  const t = useTranslations('install');
  const locale = useLocale();
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const { clientPath } = useSelectedClient();
  const planQuery = useInstallPlan(clientPath);
  const [stepIndex, setStepIndex] = useState(0);
  const [chosen, setChosen] = useState<Selection | null>(null);
  const [removeOthers, setRemoveOthers] = useState<Selection>(() => new Set());
  const [snapshotWanted, setSnapshotWanted] = useState(true);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const plan = planQuery.data ?? null;
  const catalog = plan?.catalog ?? null;
  const components = catalog?.components ?? [];
  const presets = catalog?.presets ?? [];
  const defaultPreset = presets.find((preset) => preset.id === initialPreset)?.id ?? presets[0]?.id ?? null;
  const selection = chosen ?? presetSelection({ components, presetId: defaultPreset });
  const presetId = matchingPreset({ components, presets, selection });
  const text = (value: Parameters<typeof pickLocalized>[0]['text']) => pickLocalized({ text: value, locale });
  const groups = (catalog?.categories ?? [])
    .map((category) => ({
      id: category.id,
      title: text(category.title),
      components: components
        .filter((component) => component.category === category.id)
        .map((component) => ({
          id: component.id,
          title: text(component.title),
          required: component.required,
          checked: selection.has(component.id)
        }))
    }))
    .filter((group) => group.components.length > 0);

  const focused = components.find((component) => component.id === focusedId) ?? components[0] ?? null;
  const preview = focused && {
    title: text(focused.title),
    description: text(focused.description),
    fairPlay: text(focused.fairPlay),
    video: focused.preview.video,
    src: previewSrc({ previewsDir: catalog?.previewsDir ?? null, image: focused.preview.image })
  };

  const step = INSTALL_WIZARD.steps[stepIndex] ?? INSTALL_WIZARD.steps[0];
  const takeSnapshot = snapshotWanted || removeOthers.size > 0;
  const canInstall = clientPath !== null && catalog !== null && components.length > 0 && plan?.source !== 'unavailable';

  const install = useMutation({
    mutationFn: () => installModpack({ clientPath, components: [...selection], removeOthers: [...removeOthers], takeSnapshot }),
    onSuccess: async (installation) => {
      queryClient.setQueryData(QUERY_KEYS.installation(clientPath), installation);
      await queryClient.invalidateQueries();
      toast.success(t('installed'));
      navigate({ page: 'home' });
    },
    onError: showError
  });

  const loadProfile = useMutation({
    mutationFn: async () => {
      const path = await open({ multiple: false, filters: [{ name: t('profileFilter'), extensions: [...INSTALL_WIZARD.profileExtensions] }] });

      return path ? readInstallerProfile(path) : null;
    },
    onSuccess: (ids) => {
      if (ids) {
        setChosen(closeDependencies({ components, ids }));
        toast.success(t('profileLoaded'));
      }
    },
    onError: showError
  });

  return {
    clientPath,
    planQuery,
    plan,
    step,
    stepIndex,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === INSTALL_WIZARD.steps.length - 1,
    presetId,
    presetOptions: presets.map((preset) => ({ value: preset.id, label: text(preset.title) })),
    groups,
    preview,
    selectedCount: selection.size,
    totalCount: components.length,
    removeOthers,
    takeSnapshot,
    isSnapshotForced: removeOthers.size > 0,
    canInstall,
    isInstalling: install.isPending,
    isLoadingProfile: loadProfile.isPending,
    goTo: setStepIndex,
    goNext: () => setStepIndex((index) => Math.min(index + 1, INSTALL_WIZARD.steps.length - 1)),
    goBack: () => setStepIndex((index) => Math.max(index - 1, 0)),
    onPresetChange: (id: string) => setChosen(presetSelection({ components, presetId: id })),
    onToggle: ({ id, checked }: ToggleInput) => setChosen(toggleSelection({ components, selection, id, checked })),
    onFocus: setFocusedId,
    onToggleOther: ({ id, checked }: ToggleInput) =>
      setRemoveOthers((current) => (checked ? new Set([...current, id]) : new Set([...current].filter((item) => item !== id)))),
    onSnapshotChange: setSnapshotWanted,
    onLoadProfile: () => loadProfile.mutate(),
    onInstall: () => install.mutate()
  };
};
