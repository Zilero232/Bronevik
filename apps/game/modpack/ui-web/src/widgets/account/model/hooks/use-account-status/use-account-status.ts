import { useStore } from '@nanostores/preact';

import { $state, accountState } from '../../../../../entities/window-state';

export const useAccountStatus = () => {
  const status = useStore($state)?.status ?? null;

  return {
    status,
    state: status ? accountState(status) : null,
    showForm: status ? !status.bound || status.auth_failed : false,
    accountId: status?.account_id ?? null
  };
};
