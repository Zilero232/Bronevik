'use client';

import type { ChangeEvent } from 'react';

import { useDropZone } from '@siberiacancode/reactuse';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { match, P } from 'ts-pattern';

import { getReplay } from '@/entities/replay/replay';
import { QUERY_KEYS } from '@/shared/constants';

import type { ReplayFileProblem } from '../../../lib/upload-validation';
import type { UploadPhase, UploadVisibility } from './use-replay-upload.types';

import { uploadReplay } from '../../../api';
import { REPLAY_UPLOAD } from '../../../config';
import { replayUploadErrorKind } from '../../../lib/upload-error';
import { isSettledStatus, validateReplayFile } from '../../../lib/upload-validation';

export const useReplayUpload = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [problem, setProblem] = useState<ReplayFileProblem | null>(null);
  const [visibility, setVisibility] = useState<UploadVisibility>(REPLAY_UPLOAD.defaultVisibility);
  const [progress, setProgress] = useState(0);

  const upload = useMutation({
    mutationFn: (selected: File) => uploadReplay({ file: selected, visibility, onProgress: setProgress })
  });

  const uploadedId = upload.data?.id ?? null;

  const status = useQuery({
    queryKey: QUERY_KEYS.replays.detail(uploadedId ?? ''),
    queryFn: ({ signal }) => getReplay({ id: uploadedId ?? '', signal }),
    enabled: uploadedId !== null,
    refetchInterval: (query) => (isSettledStatus(query.state.data?.status) ? false : REPLAY_UPLOAD.pollIntervalMs)
  });

  const replayStatus = status.data?.status ?? upload.data?.status;
  const isSettled = isSettledStatus(replayStatus);

  useEffect(() => {
    if (isSettled) {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.replays.all });
    }
  }, [isSettled, queryClient]);

  const select = (next: File | null | undefined) => {
    upload.reset();
    setProgress(0);

    if (!next) {
      setFile(null);
      setProblem(null);

      return;
    }

    setFile(next);
    setProblem(validateReplayFile({ file: next, rules: REPLAY_UPLOAD }));
  };

  const drop = useDropZone<HTMLLabelElement>({ onDrop: (files) => select(files?.[0]) });

  const phase: UploadPhase = match({ file, problem, upload: upload.status, replayStatus })
    .with({ file: null }, () => 'idle' as const)
    .with({ problem: P.nonNullable }, () => 'rejected' as const)
    .with({ upload: 'idle' }, () => 'selected' as const)
    .with({ upload: 'pending' }, () => 'uploading' as const)
    .with({ upload: 'error' }, () => 'failed' as const)
    .with({ replayStatus: 'parsed' }, () => 'parsed' as const)
    .with({ replayStatus: 'failed' }, () => 'failed' as const)
    .otherwise(() => 'processing' as const);

  return {
    dropRef: drop.ref,
    isDragOver: drop.overed,
    file,
    problem,
    phase,
    progress,
    visibility,
    uploadedId,
    uploadError: upload.isError ? replayUploadErrorKind(upload.error) : null,
    parseError: status.data?.status === 'failed',
    maxMegabytes: REPLAY_UPLOAD.maxBytes / REPLAY_UPLOAD.bytesPerMegabyte,
    setVisibility,
    onInputChange: (event: ChangeEvent<HTMLInputElement>) => {
      select(event.target.files?.[0]);
      event.target.value = '';
    },
    start: () => {
      if (file && problem === null) {
        upload.mutate(file);
      }
    },
    reset: () => select(null)
  };
};
