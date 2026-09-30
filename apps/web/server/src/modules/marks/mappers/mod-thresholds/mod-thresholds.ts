import type { ModMoeThresholds } from '../../marks.types';
import type { ToModMoeThresholdsInput } from './mod-thresholds.types';

export const toModMoeThresholds = ({ tankId, moe, mastery, curve }: ToModMoeThresholdsInput): ModMoeThresholds => ({
  tank_id: tankId,
  is_enough: moe !== null,
  thresholds: moe ? { '65': moe.p65, '85': moe.p85, '95': moe.p95, ...(moe.p100 === null ? {} : { '100': moe.p100 }) } : {},
  curve,
  ...(mastery ? { mastery: { class3: mastery.class3, class2: mastery.class2, class1: mastery.class1, ace: mastery.master } } : {}),
  updated_at: moe ? moe.capturedAt.toISOString() : null,
  source: moe ? moe.source : null
});
