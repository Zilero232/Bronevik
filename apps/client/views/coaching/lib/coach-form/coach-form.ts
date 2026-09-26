import { isEmpty, pickBy } from 'remeda';

import type { Coach, UpsertCoach } from '@/shared/api/coaching';

import type { CoachFormOutput, CoachFormValues, ToCoachFormValuesInput } from './coach-form.types';

export const toCoachFormValues = ({ coach, fallbackAccountId }: ToCoachFormValuesInput): CoachFormValues => ({
  accountId: coach ? String(coach.accountId) : fallbackAccountId === null ? '' : String(fallbackAccountId),
  headline: coach?.headline ?? '',
  bio: coach?.bio ?? '',
  contacts: {
    telegram: coach?.contacts.telegram ?? '',
    vk: coach?.contacts.vk ?? '',
    booking: coach?.contacts.booking ?? '',
    discord: coach?.contacts.discord ?? ''
  },
  tankIds: coach?.tankIds ?? [],
  isActive: coach?.isActive ?? true
});

export const toUpsertCoach = (values: CoachFormOutput): UpsertCoach => {
  const bio = values.bio.trim();
  const contacts: Coach['contacts'] = pickBy(
    { telegram: values.contacts.telegram, vk: values.contacts.vk, booking: values.contacts.booking, discord: values.contacts.discord.trim() },
    (value) => value !== ''
  );

  return {
    accountId: Number(values.accountId),
    headline: values.headline.trim(),
    ...(bio === '' ? {} : { bio }),
    contacts: isEmpty(contacts) ? {} : contacts,
    tankIds: values.tankIds,
    isActive: values.isActive
  };
};
