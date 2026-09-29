import type { SetFileNameInput } from './set-file-name.types';

import { COMPONENT_SET } from '../../config';

export const setFileName = ({ name, extension }: SetFileNameInput): string => {
  const safe = name.replace(COMPONENT_SET.fileNameUnsafe, COMPONENT_SET.fileNameReplacement).trim().replace(COMPONENT_SET.fileNameTrailing, '');

  return `${safe || COMPONENT_SET.fileNameFallback}.${extension}`;
};
