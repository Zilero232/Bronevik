import type { NicknameHistory } from '@bronevik/schemas';

import { mockPlayerById } from './mock-player';
import { isoDaysAgo } from './mock.helpers';

export const mockNicknames = (accountId: number): NicknameHistory => {
  const { nickname, clanTag } = mockPlayerById(accountId);

  return [
    { kind: 'nickname', value: nickname, from: isoDaysAgo(412), to: null },
    { kind: 'nickname', value: `${nickname.split('_')[0]}_Pro`, from: isoDaysAgo(1_280), to: isoDaysAgo(412) },
    { kind: 'nickname', value: `xX_${nickname.slice(0, 6)}_Xx`, from: isoDaysAgo(2_600), to: isoDaysAgo(1_280) },
    ...(clanTag ? [{ kind: 'clan' as const, value: clanTag, from: isoDaysAgo(310), to: null }] : []),
    { kind: 'clan', value: 'OLD-S', from: isoDaysAgo(1_020), to: isoDaysAgo(330) },
    { kind: 'clan', value: 'N00B', from: isoDaysAgo(2_300), to: isoDaysAgo(1_400) }
  ];
};
