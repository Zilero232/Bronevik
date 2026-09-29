import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { save } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import type { SetsView } from '@/entities/component-set';

import { COMPONENT_SET, deleteSet, duplicateSet, exportSet, exportSetFile, renameSet } from '@/entities/component-set';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast, useNavigation } from '@/shared/lib';

import type { NameDialog, UseSetActionsInput } from './use-set-actions.types';

export const useSetActions = ({ set }: UseSetActionsInput) => {
  const t = useTranslations('sets');
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const { navigate } = useNavigation();
  const [dialog, setDialog] = useState<NameDialog>(null);
  const schema = z.object({ name: z.string().trim().min(1, t('validation.name')).max(COMPONENT_SET.nameMaxLength, t('validation.name')) });
  const form = useForm({
    resolver: zodResolver(schema),
    values: { name: dialog === 'duplicate' ? t('copyName', { name: set.name }).slice(0, COMPONENT_SET.nameMaxLength) : set.name }
  });

  const store = (view: SetsView) => queryClient.setQueryData(QUERY_KEYS.sets, view);

  const rename = useMutation({
    mutationFn: (name: string) => (dialog === 'duplicate' ? duplicateSet({ id: set.id, name }) : renameSet({ id: set.id, name })),
    onSuccess: (view) => {
      store(view);
      toast.success(t(dialog === 'duplicate' ? 'duplicated' : 'renamed'));
      setDialog(null);
    },
    onError: showError
  });

  const remove = useMutation({
    mutationFn: () => deleteSet(set.id),
    onSuccess: (view) => {
      store(view);
      toast.success(t('deleted'));
    },
    onError: showError
  });

  const copyCode = useMutation({
    mutationFn: async () => navigator.clipboard.writeText(await exportSet(set.id)),
    onSuccess: () => toast.success(t('copied')),
    onError: showError
  });

  const exportFile = useMutation({
    mutationFn: async () => {
      const path = await save({
        defaultPath: `${set.name}.${COMPONENT_SET.fileExtension}`,
        filters: [{ name: t('fileFilter'), extensions: [COMPONENT_SET.fileExtension] }]
      });

      if (path) {
        await exportSetFile({ id: set.id, path });
      }

      return path;
    },
    onSuccess: (path) => {
      if (path) {
        toast.success(t('exported'));
      }
    },
    onError: showError
  });

  return {
    dialog,
    nameField: form.register('name'),
    nameError: form.formState.errors.name?.message,
    isPending: rename.isPending || remove.isPending || copyCode.isPending || exportFile.isPending,
    onApply: () => navigate({ page: 'install', params: { components: set.components } }),
    onOpenDialog: setDialog,
    onCloseDialog: () => setDialog(null),
    onDelete: () => remove.mutate(),
    onCopyCode: () => copyCode.mutate(),
    onExportFile: () => exportFile.mutate(),
    onSubmitName: form.handleSubmit(({ name }) => rename.mutate(name))
  };
};
