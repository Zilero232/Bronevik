import type { UiState } from '../../../../shared/api/protocol';

import { fontSafe } from '../../../../shared/lib/font-safe';
import { isRecord } from '../../../../shared/lib/is-record';
import { FONT_SAFE_STATE } from '../../config';

const kept: ReadonlySet<string> = new Set(FONT_SAFE_STATE.keptKeys);

const safeValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return fontSafe(value);
  }

  if (Array.isArray(value)) {
    return value.map(safeValue);
  }

  return isRecord(value) ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, kept.has(key) ? item : safeValue(item)])) : value;
};

export const fontSafeState = (state: UiState): UiState => {
  const safe = safeValue(state);

  return isRecord(safe) ? { ...state, ...safe } : state;
};
