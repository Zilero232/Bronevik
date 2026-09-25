import { createIcon } from '../lib';

export const LightTankSilhouetteIcon = createIcon({
  name: 'light-tank-silhouette',
  children: (
    <>
      <rect height='5' rx='2.5' width='17' x='2.5' y='15' />
      <path d='M6.5 17.5h.01M11 17.5h.01M15.5 17.5h.01' />
      <path d='M4 15l1.5-2.5h11L18 15' />
      <path d='M8 12.5 9 10h4l1 2.5' />
      <path d='M13.5 11h6.5' />
      <path d='M2 7.5h4M3.5 4.5h3' />
    </>
  )
});

export const MediumTankSilhouetteIcon = createIcon({
  name: 'medium-tank-silhouette',
  children: (
    <>
      <rect height='5' rx='2.5' width='18' x='2' y='15' />
      <path d='M6 17.5h.01M11 17.5h.01M16 17.5h.01' />
      <path d='M3.5 15 5 11.5h13l2 3.5' />
      <path d='M7 11.5 8 8h6.5l1.5 3.5' />
      <path d='M15.5 9.5H22' />
    </>
  )
});

export const HeavyTankSilhouetteIcon = createIcon({
  name: 'heavy-tank-silhouette',
  children: (
    <>
      <rect height='6' rx='3' width='19' x='1.5' y='14.5' />
      <path d='M5.5 17.5h.01M9.5 17.5h.01M13.5 17.5h.01M17.5 17.5h.01' />
      <path d='M2.5 14.5 4 11h14.5l2.5 3.5' />
      <path d='M5.5 11V8a2 2 0 0 1 2-2H14l2.5 5' />
      <path d='M15.5 8.5h6M21.5 7v3' />
    </>
  )
});

export const TankDestroyerSilhouetteIcon = createIcon({
  name: 'tank-destroyer-silhouette',
  children: (
    <>
      <rect height='5' rx='2.5' width='18' x='2' y='15' />
      <path d='M6 17.5h.01M11 17.5h.01M16 17.5h.01' />
      <path d='M3 15v-4l3.5-3.5H13l5.5 7.5' />
      <path d='M15.6 11H22' />
      <path d='M7 11h3' />
    </>
  )
});

export const SpgSilhouetteIcon = createIcon({
  name: 'spg-silhouette',
  children: (
    <>
      <rect height='5' rx='2.5' width='18' x='2' y='15' />
      <path d='M6 17.5h.01M11 17.5h.01M16 17.5h.01' />
      <path d='M3 15l1-3h14l1 3' />
      <path d='M7 12V9.5h6V12' />
      <path d='M11 9.5 19.5 3M18.6 1.8l1.8 2.4' />
    </>
  )
});
