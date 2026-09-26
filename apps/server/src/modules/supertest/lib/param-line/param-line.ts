import type { ParamLine, ValueCell } from './param-line.types';

import { parsedUnit } from '../param-key';
import { NUMBER_SOURCE, parseRussianNumber } from '../russian-number';

const N = `(${NUMBER_SOURCE})`;
const VERB = String.raw`(?:был[аио]?\s+)?(?:изменен\p{L}*|измен[её]н\p{L}*|увеличен\p{L}*|уменьшен\p{L}*|снижен\p{L}*|повышен\p{L}*|улучшен\p{L}*|ухудшен\p{L}*|сокращен\p{L}*|ускорен\p{L}*|замедлен\p{L}*)`;
const ARROW = String.raw`(?:→|->|—>|=>|➝|⟶|➔|>)`;

const ARROW_LINE = new RegExp(String.raw`^(.+?)\s*[:：—–-]?\s+${N}\s*([^\d→>]*?)\s*${ARROW}\s*${N}\s*(.*)$`, 'u');
const RANGE_LINE = new RegExp(String.raw`^(.+?)\s*[:：]?\s+(?:${VERB}\s+)?с\s+${N}\s*([^\d]*?)\s+до\s+${N}\s*(.*)$`, 'iu');
const WAS_LINE = new RegExp(String.raw`^(.+?)\s*[:：]\s*было\s+${N}\s*([^\d,;]*?)\s*[,;]?\s*стало\s+${N}\s*(.*)$`, 'iu');
const VALUE_LINE = new RegExp(String.raw`^([^:：]+?)\s*[:：]\s*${N}\s*([^\d]*)$`, 'u');
const VALUE_CELL = new RegExp(String.raw`^${N}\s*([^\d]*)$`, 'u');
const TRAILING = /[\s:：—–-]+$/u;
const MAX_LABEL = 80;

const cleanLabel = (label: string): string | null => {
  const cleaned = label.replace(TRAILING, '').trim();

  return cleaned.length > 0 && cleaned.length <= MAX_LABEL && /\p{L}/u.test(cleaned) ? cleaned : null;
};

const toChange = (found: RegExpExecArray | null, raw: string): ParamLine | null => {
  if (!found) {
    return null;
  }

  const [, labelText = '', fromText = '', fromUnit = '', toText = '', toUnit = ''] = found;
  const label = cleanLabel(labelText);
  const from = parseRussianNumber(fromText);
  const to = parseRussianNumber(toText);

  if (label === null || from === null || to === null) {
    return null;
  }

  return { kind: 'change', label, from, to, unit: parsedUnit(toUnit) ?? parsedUnit(fromUnit), raw };
};

export const parseValueCell = (text: string): ValueCell | null => {
  const found = VALUE_CELL.exec(text.trim());
  const value = found ? parseRussianNumber(found[1] ?? '') : null;

  return found && value !== null ? { value, unit: parsedUnit(found[2] ?? '') } : null;
};

export const parseParamLine = (line: string): ParamLine | null => {
  const raw = line.trim();

  if (raw.length === 0) {
    return null;
  }

  const change = toChange(WAS_LINE.exec(raw), raw) ?? toChange(ARROW_LINE.exec(raw), raw) ?? toChange(RANGE_LINE.exec(raw), raw);

  if (change) {
    return change;
  }

  const found = VALUE_LINE.exec(raw);
  const label = found ? cleanLabel(found[1] ?? '') : null;
  const value = found ? parseRussianNumber(found[2] ?? '') : null;

  return found && label !== null && value !== null ? { kind: 'value', label, value, unit: parsedUnit(found[3] ?? ''), raw } : null;
};
