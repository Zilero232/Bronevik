export const MOCK_SLOT_OFFSET = { chassis: 1, turret: 3, gun: 5, engine: 7, radio: 9 } as const;

export const MOCK_BUILD = {
  crewLevel: 100,
  popular: [
    { optionalDevices: [101, 103, 104], consumables: [201, 202, 204], directives: [301] },
    { optionalDevices: [101, 105, 109], consumables: [201, 202, 203], directives: [303] },
    { optionalDevices: [102, 103, 107], consumables: [201, 202, 205], directives: [302] }
  ]
} as const;
