import { useFormatter } from 'use-intl';

import { DISPLAY_FORMAT } from '../../config';

export const useDisplayFormat = () => {
  const format = useFormatter();

  return {
    stamp: (date: Date) => format.dateTime(date, DISPLAY_FORMAT.stamp),
    megabytes: (bytes: number) => format.number(bytes / DISPLAY_FORMAT.bytesPerMegabyte, DISPLAY_FORMAT.megabytes),
    kilobytes: (bytes: number) => format.number(bytes / DISPLAY_FORMAT.bytesPerKilobyte, DISPLAY_FORMAT.kilobytes)
  };
};
