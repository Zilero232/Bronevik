import { createIcon } from '../lib';

export const TracerIcon = createIcon({
  name: 'tracer',
  children: (
    <>
      <path d='M3 21l2.5-2.5M8 16l2.5-2.5' />
      <path d='M13 11l4-4' />
      <circle cx='19' cy='5' r='2' />
      <path d='M22.5 1.5l-.6.6M22.5 6h-.8M18 1.5v.8' />
    </>
  )
});

export const ShellApIcon = createIcon({
  name: 'shell-ap',
  children: (
    <>
      <path d='M9 20V10c0-3 1.2-5.5 3-7.5 1.8 2 3 4.5 3 7.5v10z' />
      <path d='M9 16h6M8 20h8' />
    </>
  )
});

export const ShellHeIcon = createIcon({
  name: 'shell-he',
  children: (
    <>
      <path d='M9 20v-8.5a3 3 0 0 1 6 0V20z' />
      <path d='M10.8 8.6 11.2 5h1.6l.4 3.6' />
      <path d='M9 16h6M8 20h8' />
      <path d='M5 6.5l1.5 1M19 6.5l-1.5 1M12 1.5v1' />
    </>
  )
});

export const ShellHeatIcon = createIcon({
  name: 'shell-heat',
  children: (
    <>
      <path d='M9 20v-9l3-7.5 3 7.5v9z' />
      <path d='M10.6 11 12 7.6l1.4 3.4' />
      <path d='M9 16h6M8 20h8' />
    </>
  )
});

export const ShellApcrIcon = createIcon({
  name: 'shell-apcr',
  children: (
    <>
      <path d='M12 2.5l1.5 4V20h-3V6.5z' />
      <path d='M8 13h8v7H8z' />
      <path d='M7 20h10' />
    </>
  )
});

export const ArmorIcon = createIcon({
  name: 'armor',
  children: (
    <>
      <path d='M4 20 11 4h9l-7 16z' />
      <path d='M8.5 20 15.5 4' />
      <path d='M2 12.5h5.5' />
    </>
  )
});

export const SpottingIcon = createIcon({
  name: 'spotting',
  children: (
    <>
      <path d='M2 14s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z' />
      <circle cx='12' cy='14' r='2.5' />
      <path d='M12 2v2.5M5.2 4l1.2 1.8M18.8 4l-1.2 1.8' />
    </>
  )
});

export const RadioIcon = createIcon({
  name: 'radio',
  children: (
    <>
      <circle cx='12' cy='8.5' r='1.5' />
      <path d='M12 10v11M9 21h6' />
      <path d='M8.5 5.5a4 4 0 0 0 0 6M15.5 5.5a4 4 0 0 1 0 6' />
      <path d='M5.5 3a7.5 7.5 0 0 0 0 11M18.5 3a7.5 7.5 0 0 1 0 11' />
    </>
  )
});

export const CrosshairIcon = createIcon({
  name: 'crosshair',
  children: (
    <>
      <circle cx='12' cy='12' r='8' />
      <path d='M12 2v4M12 18v4M2 12h4M18 12h4' />
      <path d='M9 15.5l3-2 3 2' />
      <path d='M12 10.5h.01' />
    </>
  )
});
