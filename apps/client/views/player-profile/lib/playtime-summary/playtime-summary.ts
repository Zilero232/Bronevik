import { groupBy, sortBy, sumBy } from 'remeda';

import type { PlaytimeSlot, PlaytimeSummary, PlaytimeSummaryInput, SlotsByInput } from './playtime-summary.types';

const slotsBy = ({ cells, keyOf }: SlotsByInput): PlaytimeSlot[] =>
  Object.values(groupBy(cells, (cell) => String(keyOf(cell)))).map((group) => {
    const rated = group.filter((cell) => cell.winRate !== null);
    const ratedBattles = sumBy(rated, (cell) => cell.battles);

    return {
      key: keyOf(group[0]),
      battles: sumBy(group, (cell) => cell.battles),
      winRate: ratedBattles === 0 ? 0 : sumBy(rated, (cell) => (cell.winRate ?? 0) * cell.battles) / ratedBattles
    };
  });

export const playtimeSummary = ({ cells, minBattles }: PlaytimeSummaryInput): PlaytimeSummary => {
  const hours = sortBy(
    slotsBy({ cells, keyOf: (cell) => cell.hour }).filter((slot) => slot.battles >= minBattles),
    [(slot) => slot.winRate, 'desc']
  );

  const weekdays = sortBy(
    slotsBy({ cells, keyOf: (cell) => cell.weekday }).filter((slot) => slot.battles >= minBattles),
    [(slot) => slot.winRate, 'desc']
  );

  return {
    bestHour: hours[0] ?? null,
    worstHour: hours.length > 1 ? hours[hours.length - 1] : null,
    bestWeekday: weekdays[0] ?? null
  };
};
