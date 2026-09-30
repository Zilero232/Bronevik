import { useStore } from '@nanostores/react';

import { $query, $state, accountState, openSection, SECTION, setQuery } from '../../../../../entities/window-state';

export const useHeader = () => {
  const query = useStore($query);
  const status = useStore($state)?.status ?? null;

  return {
    query,
    searching: query.length > 0,
    setQuery,
    clearQuery: () => setQuery(''),
    account: status ? { ...accountState(status), bound: status.bound && !status.auth_failed } : null,
    openAccount: () => openSection(SECTION.data)
  };
};
