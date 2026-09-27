import { sortBy } from 'remeda';

import type { CrewRoleKey, OrderCrewInput, OrderedCrewRole, ShellKindKey } from './build-usage.types';

import { CREW_ROLE_ORDER, SHELL_KINDS } from '../../config';

const KINDS: ReadonlySet<string> = new Set(SHELL_KINDS);
const ROLES: readonly string[] = CREW_ROLE_ORDER;

const isShellKind = (kind: string): kind is (typeof SHELL_KINDS)[number] => KINDS.has(kind);

export const shellKindKey = (kind: string | null): ShellKindKey => (kind !== null && isShellKind(kind) ? kind : 'unknown');

const isCrewRole = (role: string): role is CrewRoleKey => ROLES.includes(role);

export const orderCrew = ({ crew, skillsPerRole }: OrderCrewInput): OrderedCrewRole[] =>
  sortBy(
    crew.flatMap(({ role, ...rest }): OrderedCrewRole[] => (isCrewRole(role) && rest.skills.length > 0 ? [{ ...rest, role }] : [])),
    [(entry) => ROLES.indexOf(entry.role), 'asc']
  ).map((entry) => ({
    ...entry,
    skills: sortBy(entry.skills.slice(0, skillsPerRole), [(skill) => skill.avgPosition, 'asc'])
  }));
