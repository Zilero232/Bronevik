'use client';

import { useFormContext, useWatch } from 'react-hook-form';

import type { ProfileFormOutput, ProfileFormValues } from '../../../lib/profile-form';

export const useProfileIdentityFields = () => {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<ProfileFormValues, unknown, ProfileFormOutput>();

  const [slug, bio] = useWatch({ control, name: ['slug', 'bio'] });

  const slugError = errors.slug && (errors.slug.message === 'slugTaken' ? ('slugTaken' as const) : ('slug' as const));

  return {
    register,
    slug: slug.trim().toLowerCase(),
    bioLength: bio.length,
    slugError,
    hasDisplayNameError: Boolean(errors.displayName),
    hasBioError: Boolean(errors.bio)
  };
};
