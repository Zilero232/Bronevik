'use client';

import { useFormContext } from 'react-hook-form';

import type { RequirementsHost } from './use-requirements-fields.types';

import { REQUIREMENT_KEYS } from '../../../config';

export const useRequirementsFields = () => {
  const { register, formState } = useFormContext<RequirementsHost>();

  const fields = REQUIREMENT_KEYS.map((key) => ({
    key,
    field: register(`requirements.${key}`),
    isInvalid: Boolean(formState.errors.requirements?.[key])
  }));

  return { fields };
};
