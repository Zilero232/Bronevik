import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { NotFoundError } from '@/shared/api/source';

import type { ClanWorkspace } from '../../../api';
import type { WorkspaceStatusInput } from '../workspace-access.types';

import { canOwnWorkspace, isOfficerRole, viewerClanRole, workspaceStatus } from '../workspace-access';

const WORKSPACE: ClanWorkspace = {
  clanId: 1,
  clanTag: 'TAG',
  clanName: 'Clan',
  role: 'member',
  membersCount: 10,
  upcoming: [],
  candidates: {},
  createdAt: '2026-09-01T00:00:00Z'
};

const forbidden = () =>
  new AxiosError('Forbidden', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 403,
    statusText: 'Forbidden',
    data: { error: 'Only clan officers can do this', code: 'FORBIDDEN' },
    headers: {},
    config: { headers: new AxiosHeaders() }
  });

const status = (overrides: Partial<WorkspaceStatusInput>) =>
  workspaceStatus({ isViewerPending: false, isSignedIn: true, clanRole: 'private', workspace: undefined, error: null, ...overrides });

describe('roles', () => {
  it('knows the officers and the owners', () => {
    expect(isOfficerRole('junior_officer')).toBe(true);
    expect(isOfficerRole('private')).toBe(false);
    expect(isOfficerRole(null)).toBe(false);
    expect(canOwnWorkspace('executive_officer')).toBe(true);
    expect(canOwnWorkspace('combat_officer')).toBe(false);
  });

  it('picks the highest role among the linked accounts', () => {
    const members = [
      { accountId: 1, role: 'private' as const },
      { accountId: 2, role: 'combat_officer' as const },
      { accountId: 3, role: 'commander' as const }
    ];

    expect(viewerClanRole({ members, accountIds: [1, 2] })).toBe('combat_officer');
    expect(viewerClanRole({ members, accountIds: [1] })).toBe('private');
    expect(viewerClanRole({ members, accountIds: [9] })).toBeNull();
  });
});

describe('workspaceStatus', () => {
  it('waits for the viewer and asks guests to sign in', () => {
    expect(status({ isViewerPending: true })).toBe('pending');
    expect(status({ isSignedIn: false })).toBe('guest');
  });

  it('is ready once the workspace loads', () => {
    expect(status({ workspace: WORKSPACE })).toBe('ready');
  });

  it('keeps outsiders out before asking the server', () => {
    expect(status({ clanRole: null })).toBe('outsider');
  });

  it('maps the server answers', () => {
    expect(status({})).toBe('pending');
    expect(status({ error: new NotFoundError() })).toBe('missing');
    expect(status({ error: forbidden() })).toBe('forbidden');
    expect(status({ error: new Error('boom') })).toBe('error');
  });
});
