import type { ReloadTimerData } from '../../model/schemas';
import type { ReloadView } from './reload-view.types';

import { formatReload } from '../../../../../shared/lib/hud-format';

export const reloadView = (data: ReloadTimerData): ReloadView => ({
  visible: !data.ready || data.show_ready,
  progress: data.ready || data.total <= 0 ? 1 : 1 - data.left / data.total,
  seconds: data.ready ? '' : formatReload(data.left),
  ready: data.ready,
  clip: data.show_clip && data.clip > 1 && data.in_clip !== null ? `${data.in_clip}/${data.clip}` : null
});
