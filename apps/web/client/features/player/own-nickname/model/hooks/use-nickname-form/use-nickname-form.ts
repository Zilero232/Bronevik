'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { rememberOwnPlayer } from '@/entities/player/own-player';
import { playerQueries } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import type { NicknameFormValues } from '../../../lib/nickname-form';
import type { UseNicknameFormInput } from './use-nickname-form.types';

import { NICKNAME_FORM_DEFAULT_VALUES } from '../../../config';
import { nicknameErrorKind, nicknameFormSchema } from '../../../lib/nickname-form';

export const useNicknameForm = ({ onDone }: UseNicknameFormInput = {}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<NicknameFormValues>({ resolver: zodResolver(nicknameFormSchema), defaultValues: NICKNAME_FORM_DEFAULT_VALUES });

  const onSubmit = handleSubmit(async ({ nickname }) => {
    try {
      const profile = await queryClient.fetchQuery(playerQueries.profile(nickname));

      queryClient.setQueryData(QUERY_KEYS.player.profile(String(profile.summary.accountId)), profile);
      rememberOwnPlayer(profile.summary);
      reset(NICKNAME_FORM_DEFAULT_VALUES);
      onDone?.();
    } catch (error) {
      setError('nickname', { type: isNotFoundError(error) ? 'notFound' : 'server' });
    }
  });

  return { register, onSubmit, error: nicknameErrorKind(errors.nickname?.type), isSubmitting };
};
