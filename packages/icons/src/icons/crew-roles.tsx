import { createIcon } from '../lib';

export const CrewCommanderIcon = createIcon({
  name: 'crew-commander',
  children: (
    <>
      <path d='M6 9.5h12l-1.2-3.8L12 4 7.2 5.7z' />
      <path d='M7.5 9.5a4.5 4.5 0 0 0 9 0' />
      <path d='M4.5 21c.8-3.6 3.8-6 7.5-6s6.7 2.4 7.5 6' />
      <path d='m12 5.6.5 1.1 1.2.1-.9.8.3 1.2-1.1-.6-1.1.6.3-1.2-.9-.8 1.2-.1z' />
    </>
  )
});

export const CrewDriverIcon = createIcon({
  name: 'crew-driver',
  children: (
    <>
      <circle cx='12' cy='12' r='8.5' />
      <circle cx='12' cy='12' r='2' />
      <path d='M12 14v6.5M10.1 11.2 4 9.6M13.9 11.2 20 9.6' />
    </>
  )
});

export const CrewGunnerIcon = createIcon({
  name: 'crew-gunner',
  children: (
    <>
      <circle cx='12' cy='12' r='6.5' />
      <path d='M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5' />
      <circle cx='12' cy='12' r='1' />
    </>
  )
});

export const CrewLoaderIcon = createIcon({
  name: 'crew-loader',
  children: (
    <>
      <path d='M7 20V10.5c0-2.6 1-4.8 2.5-6.5C11 5.7 12 7.9 12 10.5V20z' />
      <path d='M12 20v-7.5a2.5 2.5 0 0 1 5 0V20z' />
      <path d='M5.5 20h13M7 16h5' />
    </>
  )
});

export const CrewRadiomanIcon = createIcon({
  name: 'crew-radioman',
  children: (
    <>
      <path d='M5 12a7 7 0 0 1 14 0' />
      <path d='M4 12h3v6H5a1 1 0 0 1-1-1zM20 12h-3v6h2a1 1 0 0 0 1-1z' />
      <path d='M17 18c0 1.7-1.8 2.5-4 2.5' />
    </>
  )
});
