import { createIcon } from '../lib';

export const EquipStandardIcon = createIcon({
  name: 'equip-standard',
  children: (
    <>
      <circle cx='12' cy='12' r='3' />
      <path d='M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8' />
    </>
  )
});

export const EquipTrophyIcon = createIcon({
  name: 'equip-trophy',
  children: (
    <>
      <path d='M7 4h10v5a5 5 0 0 1-10 0z' />
      <path d='M7 6H4.5v1.5A3 3 0 0 0 7.5 10.5M17 6h2.5v1.5a3 3 0 0 1-3 3' />
      <path d='M12 14v3.5M8.5 20.5h7l-.8-3h-5.4z' />
    </>
  )
});

export const EquipBondsIcon = createIcon({
  name: 'equip-bonds',
  children: (
    <>
      <path d='M12 3 20 8v8l-8 5-8-5V8z' />
      <path d='m12 7.5 4.5 2.8v4.4L12 17.5l-4.5-2.8v-4.4z' />
    </>
  )
});

export const EquipExperimentalIcon = createIcon({
  name: 'equip-experimental',
  children: (
    <>
      <path d='M9.5 3h5M10.5 3v6l-5.3 9.2A1.9 1.9 0 0 0 6.9 21h10.2a1.9 1.9 0 0 0 1.7-2.8L13.5 9V3' />
      <path d='M7.8 15h8.4' />
    </>
  )
});

export const EquipDirectiveIcon = createIcon({
  name: 'equip-directive',
  children: (
    <>
      <path d='M6 3h9l3 3v15H6z' />
      <path d='M9 9h6M9 12.5h6M9 16h4' />
    </>
  )
});

export const EquipConsumableIcon = createIcon({
  name: 'equip-consumable',
  children: (
    <>
      <rect height='13' rx='1.5' width='16' x='4' y='7' />
      <path d='M9 7V4.5h6V7M12 10.5v6M9 13.5h6' />
    </>
  )
});
