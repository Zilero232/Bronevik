import type { MANAGER_LINK } from '../../config';

export type ManagerPreset = (typeof MANAGER_LINK.presets)[number];

export type ManagerLinkTarget = { kind: 'install'; preset?: ManagerPreset } | { kind: 'open' } | { kind: 'profile'; code: string };
