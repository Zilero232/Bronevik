import { useStore } from '@nanostores/preact';
import { useMemo } from 'preact/hooks';

import type { ReplaysText } from '../../../lib/replays-text';

import { $state } from '../../../../../entities/window-state';
import { DEFAULT_LANGUAGE } from '../../../../../shared/i18n';
import { replaysText } from '../../../lib/replays-text';

export const useReplaysT = (): ReplaysText => {
  const language = useStore($state)?.language ?? DEFAULT_LANGUAGE;

  return useMemo(() => replaysText(language), [language]);
};
