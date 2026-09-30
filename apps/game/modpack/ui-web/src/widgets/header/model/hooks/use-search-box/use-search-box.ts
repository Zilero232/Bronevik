import { useEffect, useRef } from 'preact/hooks';

import type { UseSearchBoxInput } from './use-search-box.types';

import { bindFindKey } from '../../../../../shared/lib/find-key';

export const useSearchBox = ({ query, onClear }: UseSearchBoxInput) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => bindFindKey({ root: document, onFind: () => inputRef.current?.focus() }), []);

  return {
    inputRef,
    onEscape: query ? onClear : undefined
  };
};
