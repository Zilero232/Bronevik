import type { ConsumablesData, ReloadTimerData } from '../../model/schemas';

export type SlotView = ConsumablesData['slots'][number] & { key: number; progress: number; seconds: string; alpha: number };

export type ConsumablesView = { slots: SlotView[]; shells: (ConsumablesData['shells'][number] & { key: number; count: string })[] };

export type ReloadView = { visible: boolean; progress: number; seconds: string; ready: boolean; clip: string | null };

export type { ReloadTimerData };
