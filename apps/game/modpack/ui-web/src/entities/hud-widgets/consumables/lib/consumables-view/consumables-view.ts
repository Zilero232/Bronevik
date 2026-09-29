import type { ConsumablesData } from '../../model/schemas';
import type { ConsumablesView, ReloadTimerData, ReloadView } from './consumables-view.types';

import { formatNumber, formatReload, formatSeconds } from '../../../../../shared/lib/hud-format';
import { CONSUMABLES } from '../../config';

export const consumablesView = (data: ConsumablesData): ConsumablesView => ({
  slots: data.slots.map((slot, key) => ({
    ...slot,
    key,
    progress: slot.total > 0 ? slot.remaining / slot.total : 0,
    seconds: slot.remaining > 0 ? formatSeconds(slot.remaining) : '',
    alpha: slot.quantity > 0 ? 1 : CONSUMABLES.spentAlpha
  })),
  shells: data.shells.map((shell, key) => ({ ...shell, key, count: formatNumber(shell.quantity) }))
});

export const reloadView = (data: ReloadTimerData): ReloadView => ({
  visible: !data.ready || data.show_ready,
  progress: data.ready || data.total <= 0 ? 1 : 1 - data.left / data.total,
  seconds: data.ready ? '' : formatReload(data.left),
  ready: data.ready,
  clip: data.show_clip && data.clip > 1 && data.in_clip !== null ? `${data.in_clip}/${data.clip}` : null
});
