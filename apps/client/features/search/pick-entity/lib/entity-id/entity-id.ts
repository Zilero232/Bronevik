import type { PickableKind, PickableResult } from '../../model/hooks/use-entity-search';

export const entityId = (result: PickableResult<PickableKind>): number => (result.kind === 'player' ? result.accountId : result.vehicle.tankId);
