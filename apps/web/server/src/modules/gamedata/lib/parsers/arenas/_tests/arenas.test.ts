import { describe, expect, it } from 'vitest';

import { COMMON_FIXTURES, readFixture } from '../../../_tests/fixtures';
import { arenaDisplayName, isBattleArena, minimapImagePath, parseArena, parseArenaList } from '../arenas';

describe('parseArenaList', () => {
  it('reads numeric ids and geometry names, and tells battle maps apart', () => {
    const list = parseArenaList(readFixture(COMMON_FIXTURES.arenaList));

    expect(list[0]).toEqual({ id: 1, name: '01_karelia' });
    expect(list.filter((item) => isBattleArena(item.name)).length).toBe(list.length - 1);
  });
});

describe('parseArena', () => {
  const arena = parseArena({ xml: readFixture(COMMON_FIXTURES.arena), arenaId: '01_karelia', numericId: 1 });

  it('reads bounds, size and camouflage', () => {
    expect(arena?.sizeMeters).toBe((arena?.boundingBox.upperRight[0] ?? 0) - (arena?.boundingBox.bottomLeft[0] ?? 0));
    expect(arena?.camouflageKind).toBe('summer');
    expect(arena?.displayName).toBe(arenaDisplayName('01_karelia'));
  });

  it('reads gameplay types with bases, spawns and mode minimaps', () => {
    const ctf = arena?.gameplay.find((mode) => mode.type === 'ctf');
    const assault = arena?.gameplay.find((mode) => mode.type === 'assault2');

    expect(arena?.gameplayTypes).toEqual(['ctf', 'domination', 'assault2']);
    expect(Object.keys(ctf?.teamBasePositions ?? {})).toEqual(['team1', 'team2']);
    expect(ctf?.teamBasePositions.team1[0]).toHaveLength(2);
    expect(assault?.minimapImage).toBe(minimapImagePath({ minimap: assault?.minimap, arenaId: '01_karelia' }));
  });

  it('maps client minimap textures onto the wot.maps file names', () => {
    expect(minimapImagePath({ minimap: 'spaces/01_karelia/mmap.dds', arenaId: '01_karelia' })).toBe('maps/01_karelia.webp');
    expect(minimapImagePath({ minimap: 'spaces/01_karelia/mmap_comp7.dds', arenaId: '01_karelia' })).toBe('maps/01_karelia_comp7.webp');
    expect(arena?.minimapImage).toBe('maps/01_karelia.webp');
  });
});
