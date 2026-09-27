import { decodeHTML } from 'entities';
import { findLast } from 'remeda';

import type { CompareVersionsInput, PacketSupport, ResolveSupportInput, VehicleMethodIds } from './packets.types';

import { PACKET_SUPPORT, WG_VEHICLE_METHOD_IDS } from './packets.constants';

export const compareVersions = ({ left, right }: CompareVersionsInput) => {
  for (let index = 0; index < 4; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);

    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
};

export const htmlToText = (html: string) => decodeHTML(html.replace(/<[^>]*>/g, '')).replaceAll(' ', ' ');

export const wgVehicleMethodIds = (version: readonly number[]): VehicleMethodIds | null =>
  findLast(WG_VEHICLE_METHOD_IDS, (entry) => compareVersions({ left: version, right: entry.since }) >= 0)?.ids ?? null;

export const resolveSupport = ({ game, methodIds, version }: ResolveSupportInput): PacketSupport => {
  const label = version ? version.join('.') : null;
  const notes: string[] = [];

  if (!version || compareVersions({ left: version, right: PACKET_SUPPORT.minVersion }) < 0) {
    notes.push(`Packet decoding needs client ${PACKET_SUPPORT.minVersion.join('.')} or newer; packets are returned raw.`);

    return { game, methodIds: null, methodIdSource: 'none', notes, status: 'unsupported', version: label };
  }

  const verifiedWg = game === 'wg' && compareVersions({ left: version, right: PACKET_SUPPORT.wgVerifiedUntil }) <= 0;
  const status = verifiedWg ? 'verified' : 'best-effort';

  if (!verifiedWg) {
    notes.push(
      game === 'lesta'
        ? 'Lesta client: packet framing and the position, chat, version and period layouts are assumed to match WG BigWorld; not yet verified against real .mtreplay files.'
        : `Client ${label} is outside the verified WG range; layouts are assumed unchanged.`
    );
  }

  if (methodIds) {
    return { game, methodIds, methodIdSource: 'custom', notes, status, version: label };
  }

  const tableIds = verifiedWg ? wgVehicleMethodIds(version) : null;

  if (!tableIds) {
    notes.push('Vehicle method ids are version-specific: pass `methodIds` to decode damage and shot events; entity methods are returned raw.');
  }

  return {
    game,
    methodIds: tableIds,
    methodIdSource: tableIds ? 'wg-table' : 'none',
    notes,
    status,
    version: label
  };
};
