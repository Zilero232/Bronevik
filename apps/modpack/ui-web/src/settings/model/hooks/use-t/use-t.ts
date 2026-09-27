import { useStore } from '@nanostores/preact';

import type { StringKey } from '../../../../shared/i18n/i18n.types';

import { translator } from '../../../../shared/i18n/i18n';
import { $state } from '../../store/store';

export const useT = (): ((key: StringKey) => string) => translator(useStore($state)?.language ?? 'ru');
