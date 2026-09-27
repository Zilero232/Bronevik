import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { listenEvent } from '@/shared/api';
import { EVENTS, QUERY_KEYS } from '@/shared/config';

import { patchReportSchema } from '../../../api';

export const usePatchReportEvents = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unlisten = listenEvent({
      event: EVENTS.patchReport,
      schema: patchReportSchema,
      onPayload: (report) => {
        queryClient.setQueryData(QUERY_KEYS.patchReport, report);
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.installation(report.clientPath) });
      }
    });

    return () => {
      void unlisten.then((stop) => stop());
    };
  }, [queryClient]);
};
