import type { z } from 'zod';

import type { REQUIREMENT_KEYS } from '../../config';
import type { requirementsFormSchema } from './requirements.schemas';

export type RequirementKey = (typeof REQUIREMENT_KEYS)[number];

export type StatRequirements = Partial<Record<RequirementKey, number>>;

export type RequirementEntry = {
  key: RequirementKey;
  value: number;
};

export type RequirementsFormValues = z.input<typeof requirementsFormSchema>;

export type RequirementsFormOutput = z.output<typeof requirementsFormSchema>;

export type OptionalNumberRule = {
  max?: number;
  isInteger?: boolean;
};
