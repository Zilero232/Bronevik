import type { ApplicableGroup } from '@otmetki/schemas';
import type { FormEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { ApplyFormValues, HardwareOptions } from '../../../lib/apply-form';

export type ApplySettingsFormProps = {
  form: UseFormReturn<ApplyFormValues>;
  groupOptions: { value: ApplicableGroup; label: string }[];
  options: HardwareOptions;
  isPending: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
};
