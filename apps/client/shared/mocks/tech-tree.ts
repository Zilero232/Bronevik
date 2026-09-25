import type { Nation, TankClass, Tier } from '@bronevik/icons';

import type { MockTank, MockTreeEdge, MockTreeLine, SyntheticTankInput } from './mocks.types';

import { seededRandom } from '../lib/seeded-random';
import { mockVehicleImages } from './vehicle-images';
import { MOCK_VEHICLES } from './vehicles';

const LINES: Partial<Record<Nation, MockTreeLine[]>> = {
  ussr: [
    {
      type: 'lightTank',
      tanks: [
        [1, 'МС-1'],
        [2, 'Т-26'],
        [3, 'Т-46']
      ]
    },
    {
      type: 'mediumTank',
      from: 'Т-46',
      tanks: [
        [4, 'Т-28'],
        [5, 'Т-34'],
        [6, 'Т-34-85'],
        [7, 'Т-43'],
        [8, 'Т-44'],
        [9, 'Т-54'],
        [10, 'Объект 140']
      ]
    },
    { type: 'mediumTank', from: 'Т-54', tanks: [[10, 'Т-62А']] },
    {
      type: 'lightTank',
      from: 'Т-46',
      tanks: [
        [4, 'Т-80'],
        [5, 'Т-50'],
        [6, 'МТ-25'],
        [7, 'ЛТГ'],
        [8, 'ЛТТБ'],
        [9, 'Т-54 обл.'],
        [10, 'Т-100 ЛТ']
      ]
    },
    {
      type: 'heavyTank',
      from: 'Т-28',
      tanks: [
        [5, 'КВ-1'],
        [6, 'КВ-1С'],
        [7, 'ИС'],
        [8, 'ИС-3'],
        [9, 'ИС-8'],
        [10, 'ИС-7']
      ]
    },
    {
      type: 'heavyTank',
      from: 'КВ-1',
      tanks: [
        [6, 'Т-150'],
        [7, 'КВ-3'],
        [8, 'КВ-4'],
        [9, 'СТ-I'],
        [10, 'ИС-4']
      ]
    },
    {
      type: 'heavyTank',
      from: 'ИС',
      tanks: [
        [8, 'ИС-М'],
        [9, 'Объект 257'],
        [10, 'Объект 277']
      ]
    },
    {
      type: 'AT-SPG',
      from: 'МС-1',
      tanks: [
        [2, 'АТ-1'],
        [3, 'СУ-76'],
        [4, 'СУ-85Б'],
        [5, 'СУ-85'],
        [6, 'СУ-100'],
        [7, 'СУ-152'],
        [8, 'ИСУ-152'],
        [9, 'Объект 704'],
        [10, 'Объект 268']
      ]
    },
    {
      type: 'SPG',
      from: 'МС-1',
      tanks: [
        [2, 'СУ-18'],
        [3, 'СУ-26'],
        [4, 'СУ-5'],
        [5, 'СУ-122А'],
        [6, 'СУ-8'],
        [7, 'С-51'],
        [8, 'СУ-14-2'],
        [9, '212А'],
        [10, 'Объект 261']
      ]
    }
  ],
  germany: [
    {
      type: 'lightTank',
      tanks: [
        [1, 'Leichttraktor'],
        [2, 'Pz.Kpfw. II'],
        [3, 'Pz.Kpfw. 38 (t)']
      ]
    },
    {
      type: 'mediumTank',
      from: 'Pz.Kpfw. 38 (t)',
      tanks: [
        [4, 'Pz.Kpfw. III'],
        [5, 'Pz.Kpfw. IV Ausf. H'],
        [6, 'VK 30.01 (D)'],
        [7, 'Panther'],
        [8, 'Panther II'],
        [9, 'E 50'],
        [10, 'E 50 Ausf. M']
      ]
    },
    {
      type: 'mediumTank',
      from: 'Panther',
      tanks: [
        [8, 'Indien-Panzer'],
        [9, 'Leopard PT A'],
        [10, 'Leopard 1']
      ]
    },
    {
      type: 'heavyTank',
      from: 'Pz.Kpfw. IV Ausf. H',
      tanks: [
        [6, 'VK 36.01 (H)'],
        [7, 'Tiger I'],
        [8, 'Tiger II'],
        [9, 'E 75'],
        [10, 'E 100']
      ]
    },
    {
      type: 'heavyTank',
      from: 'VK 36.01 (H)',
      tanks: [
        [7, 'Tiger (P)'],
        [8, 'VK 100.01 (P)'],
        [9, 'Mäuschen'],
        [10, 'Maus']
      ]
    },
    {
      type: 'heavyTank',
      from: 'Tiger (P)',
      tanks: [
        [8, 'VK 45.02 (P) Ausf. A'],
        [9, 'VK 45.02 (P) Ausf. B'],
        [10, 'Pz.Kpfw. VII']
      ]
    },
    {
      type: 'AT-SPG',
      from: 'Leichttraktor',
      tanks: [
        [2, 'Panzerjäger I'],
        [3, 'Marder II'],
        [4, 'Hetzer'],
        [5, 'StuG III Ausf. G'],
        [6, 'Jagdpanzer IV'],
        [7, 'Jagdpanther'],
        [8, 'Ferdinand'],
        [9, 'Jagdtiger'],
        [10, 'Jagdpanzer E 100']
      ]
    },
    {
      type: 'AT-SPG',
      from: 'Jagdpanzer IV',
      tanks: [
        [7, 'Sturer Emil'],
        [8, 'Rhm.-Borsig Waffenträger'],
        [9, 'Waffenträger auf Pz. IV'],
        [10, 'Grille 15']
      ]
    },
    {
      type: 'lightTank',
      from: 'Pz.Kpfw. III',
      tanks: [
        [7, 'Spähpanzer SP I C'],
        [8, 'HWK 12'],
        [9, 'Ru 251'],
        [10, 'Rheinmetall Panzerwagen']
      ]
    },
    {
      type: 'SPG',
      from: 'Pz.Kpfw. II',
      tanks: [
        [3, 'Wespe'],
        [4, 'Grille'],
        [5, 'Hummel'],
        [6, 'G.W. Panther'],
        [7, 'G.W. Tiger (P)'],
        [8, 'G.W. Tiger'],
        [9, 'G.W. Typ E'],
        [10, 'G.W. E 100']
      ]
    }
  ],
  usa: [
    {
      type: 'lightTank',
      tanks: [
        [1, 'T1 Cunningham'],
        [2, 'M2 Light Tank'],
        [3, 'M3 Stuart'],
        [4, 'M5 Stuart']
      ]
    },
    {
      type: 'mediumTank',
      from: 'M5 Stuart',
      tanks: [
        [5, 'M4 Sherman'],
        [6, 'M4A3E8 Sherman'],
        [7, 'T20'],
        [8, 'M26 Pershing'],
        [9, 'M46 Patton'],
        [10, 'M48A5 Patton']
      ]
    },
    {
      type: 'heavyTank',
      from: 'M4 Sherman',
      tanks: [
        [6, 'M6'],
        [7, 'T29'],
        [8, 'T32'],
        [9, 'M103'],
        [10, 'T110E5']
      ]
    },
    {
      type: 'heavyTank',
      from: 'T20',
      tanks: [
        [8, 'T69'],
        [9, 'T54E1'],
        [10, 'T57 Heavy Tank']
      ]
    },
    {
      type: 'heavyTank',
      from: 'T29',
      tanks: [
        [8, 'M-IV-Y'],
        [9, 'M-VI-Y'],
        [10, 'M-V-Y']
      ]
    },
    {
      type: 'lightTank',
      from: 'M5 Stuart',
      tanks: [
        [7, 'M24 Chaffee'],
        [8, 'M41 Walker Bulldog'],
        [9, 'T49'],
        [10, 'XM551 Sheridan']
      ]
    },
    {
      type: 'AT-SPG',
      from: 'T1 Cunningham',
      tanks: [
        [2, 'T18'],
        [3, 'T82'],
        [4, 'M8A1'],
        [5, 'M10 Wolverine'],
        [6, 'M36 Jackson'],
        [7, 'T25 AT'],
        [8, 'T28 Prototype'],
        [9, 'T30'],
        [10, 'T110E4']
      ]
    },
    {
      type: 'SPG',
      from: 'M2 Light Tank',
      tanks: [
        [3, 'M7 Priest'],
        [4, 'M37'],
        [5, 'M41 HMC'],
        [6, 'M44'],
        [7, 'M12'],
        [8, 'M40/M43'],
        [9, 'M53/M55'],
        [10, 'T92 HMC']
      ]
    }
  ]
};

const PREMIUMS: Partial<Record<Nation, string[]>> = {
  ussr: ['ЛТ-432', 'Defender', 'ИС-6', 'Объект 907'],
  germany: ['Löwe', 'Kpz 50 t'],
  usa: []
};

const hash = (value: string) => [...value].reduce((acc, char) => (acc * 33 + char.charCodeAt(0)) >>> 0, 5381);

const slugify = (name: string) =>
  `tree-${hash(name).toString(36)}-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`.replace(/-$/, '');

const synthetic = ({ name, nation, type, tier }: SyntheticTankInput): MockTank => {
  const random = seededRandom(hash(name));
  const avgDamage = Math.round(90 + tier * tier * 32 + random() * 120);

  return {
    id: 200_000 + (hash(name) % 90_000) * 8,
    slug: slugify(name),
    name,
    nation,
    type,
    tier,
    isPremium: false,
    winRate: Math.round((48 + random() * 4) * 100) / 100,
    avgDamage,
    moe3: Math.round(avgDamage * 1.55),
    battles: Math.round(120_000 + random() * 900_000),
    trend: [],
    images: mockVehicleImages(name)
  };
};

const byName = (name: string, nation: Nation) => MOCK_VEHICLES.find((tank) => tank.name === name && tank.nation === nation);

const fallbackLines = (nation: Nation): MockTreeLine[] =>
  (['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG'] as const).flatMap((type) => {
    const tanks = MOCK_VEHICLES.filter((tank) => tank.nation === nation && tank.type === type && !tank.isPremium).sort((a, b) => a.tier - b.tier);

    return tanks.length > 0 ? [{ type, tanks: tanks.map((tank): [Tier, string] => [tank.tier, tank.name]) }] : [];
  });

export const mockTechTree = (nation: Nation) => {
  const lines = LINES[nation] ?? fallbackLines(nation);
  const tanks = new Map<string, MockTank>();
  const edges: MockTreeEdge[] = [];

  const resolve = (name: string, type: TankClass, tier: Tier) => {
    const known = tanks.get(name) ?? byName(name, nation) ?? synthetic({ name, nation, type, tier });

    tanks.set(name, known);

    return known;
  };

  lines.forEach(({ type, from, tanks: chain }) => {
    let previous = from ? tanks.get(from) : undefined;

    chain.forEach(([tier, name]) => {
      const current = resolve(name, type, tier);

      if (previous) {
        edges.push({ from: previous.id, to: current.id });
      }

      previous = current;
    });
  });

  const premiums = (PREMIUMS[nation] ?? MOCK_VEHICLES.filter((tank) => tank.nation === nation && tank.isPremium).map(({ name }) => name))
    .map((name) => byName(name, nation))
    .filter((tank): tank is MockTank => tank !== undefined);

  return { tanks: [...tanks.values()], premiums, edges };
};

export const MOCK_TREE_VEHICLES: MockTank[] = (['ussr', 'germany', 'usa'] as const).flatMap((nation) =>
  mockTechTree(nation).tanks.filter((tank) => !MOCK_VEHICLES.includes(tank))
);
