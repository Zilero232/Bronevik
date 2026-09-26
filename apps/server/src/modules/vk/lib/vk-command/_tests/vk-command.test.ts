import { describe, expect, it } from 'vitest';

import { parseVkCommand } from '../vk-command';

describe('parseVkCommand', () => {
  it('reads Russian and English aliases with an optional slash and argument', () => {
    expect(parseVkCommand('стата Tanker_1')).toEqual({ command: 'stats', argument: 'Tanker_1' });
    expect(parseVkCommand('/tank Об. 140')).toEqual({ command: 'tank', argument: 'Об. 140' });
    expect(parseVkCommand('ТОП')).toEqual({ command: 'top', argument: '' });
  });

  it('strips the community mention of chat messages', () => {
    expect(parseVkCommand('[club123|@otmetki], сессия')).toEqual({ command: 'session', argument: '' });
  });

  it('ignores everything else', () => {
    expect(parseVkCommand('привет')).toBeNull();
    expect(parseVkCommand('')).toBeNull();
  });
});
