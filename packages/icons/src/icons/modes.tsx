import { createIcon } from '../lib';

export const RandomBattleIcon = createIcon({
  name: 'mode-random',
  children: (
    <>
      <rect height='18' rx='4' width='18' x='3' y='3' />
      <path d='M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01' />
    </>
  )
});

export const RankedBattleIcon = createIcon({
  name: 'mode-ranked',
  children: (
    <>
      <path d='M12 2 20.5 7v10L12 22 3.5 17V7z' />
      <path d='M8 13.5l4-3 4 3M8 17l4-3 4 3' />
      <path d='M12 6.5h.01' />
    </>
  )
});

export const OnslaughtIcon = createIcon({
  name: 'mode-onslaught',
  children: (
    <>
      <path d='M3.5 6l6 6-6 6M10.5 6l6 6-6 6' />
      <path d='M20.5 5v14' />
    </>
  )
});

export const FrontlineIcon = createIcon({
  name: 'mode-frontline',
  children: (
    <>
      <path d='M2 18l4-4 4 4 4-4 4 4 4-4' />
      <path d='M12 14V3l6 2.5-6 2.5' />
    </>
  )
});

export const StrongholdIcon = createIcon({
  name: 'mode-stronghold',
  children: (
    <>
      <path d='M3 21V8h3v3h3V8h6v3h3V8h3v13z' />
      <path d='M10 21v-4a2 2 0 0 1 4 0v4' />
      <path d='M12 8V3l3 1.2L12 5.4' />
    </>
  )
});

export const GlobalMapIcon = createIcon({
  name: 'mode-globalmap',
  children: (
    <>
      <circle cx='12' cy='12' r='9.5' />
      <path d='M12 2.5a4.5 9.5 0 0 1 0 19a4.5 9.5 0 0 1 0-19' />
      <path d='M3 9h18M3 15h18' />
    </>
  )
});

export const TrainingIcon = createIcon({
  name: 'mode-training',
  children: (
    <>
      <path d='M10 3h4l5 15H5z' />
      <path d='M7.9 10.5h8.2M6.6 14.5h10.8' />
      <path d='M3 21h18' />
    </>
  )
});
