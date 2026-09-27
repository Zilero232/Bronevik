import type { PickableKind, PickableResult } from '../search-kind';

export const entityId = (result: PickableResult<PickableKind>): number => (result.kind === 'player' ? result.accountId : result.vehicle.tankId);
