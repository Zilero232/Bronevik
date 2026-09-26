'use client';

import { useMutation } from '@tanstack/react-query';

import { createCheckout } from '@/shared/api/billing';

export const usePlusCheckout = () =>
  useMutation({
    mutationFn: createCheckout,
    onSuccess: ({ confirmationUrl }) => window.location.assign(confirmationUrl)
  });
