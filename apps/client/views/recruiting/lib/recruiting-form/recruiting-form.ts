import type { CreateRecruiting } from '@/shared/api/recruiting';

import { toStatRequirements } from '@/features/community/stat-requirements';
import { chosenAccountId } from '@/features/community/viewer';

import type { ToCreateRecruitingInput } from './recruiting-form.types';

export const toCreateRecruiting = ({ values, kind, clanId }: ToCreateRecruitingInput): CreateRecruiting => {
  const accountId = chosenAccountId(values.accountId);
  const isClan = kind === 'clan_seeks_player';

  return {
    kind,
    title: values.title.trim(),
    body: values.body.trim(),
    ...(accountId === undefined ? {} : { accountId }),
    ...(isClan && clanId !== null ? { clanId } : {}),
    requirements: isClan ? toStatRequirements(values.requirements) : {},
    expiresInDays: Number(values.expiresInDays)
  };
};
