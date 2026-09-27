import { useSelectedClient } from '@/entities/client';
import { useNavigation } from '@/shared/lib';

export const useProfilesView = () => {
  const { params } = useNavigation();
  const { clientPath } = useSelectedClient();

  return { clientPath, initialCode: params.profileCode ?? '', isDisabled: clientPath === null };
};
