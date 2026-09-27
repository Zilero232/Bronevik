import { match } from 'ts-pattern';

import { useDeepLinks } from '@/entities/deep-link';
import { usePatchReportEvents } from '@/entities/patch-report';
import { useNavigation } from '@/shared/lib';

export const useAppSync = () => {
  const { navigate } = useNavigation();

  usePatchReportEvents();

  useDeepLinks({
    onLink: (link) =>
      match(link)
        .with({ kind: 'open' }, () => navigate({ page: 'home' }))
        .with({ kind: 'profile' }, ({ code }) => navigate({ page: 'profiles', params: { profileCode: code } }))
        .with({ kind: 'install' }, ({ preset }) => navigate({ page: 'install', params: { preset } }))
        .exhaustive()
  });
};
