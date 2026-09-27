import type { QueryKey, UseMutationOptions } from '@tanstack/react-query';
import type { DefaultValues, FieldValues } from 'react-hook-form';
import type { z } from 'zod';

import type { useRouter } from '@/shared/i18n/navigation';

import type { useFormDialog } from './use-form-dialog';

type FormDialogMutation<TOutput, TData> = UseMutationOptions<TData, Error, TOutput>;

export type UseFormDialogInput<TValues extends FieldValues, TOutput extends FieldValues, TData> = Pick<
  FormDialogMutation<TOutput, TData>,
  'onSuccess'
> &
  Required<Pick<FormDialogMutation<TOutput, TData>, 'mutationFn'>> & {
    schema: z.ZodType<TOutput, TValues>;
    defaults: DefaultValues<TValues>;
    successMessage: string;
    errorMessage: (error: Error) => string;
    invalidate?: QueryKey;
    redirect?: (data: TData) => Parameters<ReturnType<typeof useRouter>['push']>[0];
  };

export type FormDialogModel<TValues extends FieldValues, TOutput extends FieldValues> = ReturnType<typeof useFormDialog<TValues, TOutput, unknown>>;
