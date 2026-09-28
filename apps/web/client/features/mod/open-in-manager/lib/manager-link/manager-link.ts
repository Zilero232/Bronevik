import { match } from 'ts-pattern';

import type { ManagerLinkTarget } from './manager-link.types';

import { MANAGER_LINK } from '../../config';

export const managerLink = (target: ManagerLinkTarget): string => {
  const { scheme, hosts, presetParam } = MANAGER_LINK;

  return match(target)
    .with({ kind: 'open' }, () => `${scheme}://${hosts.open}`)
    .with({ kind: 'profile' }, ({ code }) => `${scheme}://${hosts.profile}/${code}`)
    .with({ kind: 'install' }, ({ preset }) =>
      preset ? `${scheme}://${hosts.install}?${new URLSearchParams({ [presetParam]: preset }).toString()}` : `${scheme}://${hosts.install}`
    )
    .exhaustive();
};

export const parseProfileCode = (raw: string | null | undefined): string | null => {
  const code = raw?.trim() ?? '';
  const { maxLength, pattern } = MANAGER_LINK.profileCode;

  return code.length <= maxLength && pattern.test(code) ? code : null;
};
