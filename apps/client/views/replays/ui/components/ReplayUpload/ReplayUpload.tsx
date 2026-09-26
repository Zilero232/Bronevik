'use client';

import { FileUp } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useId } from 'react';

import { CommunityGate } from '@/features/community/viewer';
import { Button, Card, CardBody, CardHeader, ProgressBar, SegmentedControl } from '@/ui-kit';

import type { UploadVisibility } from '../../../model/hooks';

import { REPLAY_UPLOAD, REPLAY_VISIBILITIES } from '../../../config';
import { useReplayUpload } from '../../../model/hooks';
import { UploadOutcome } from './components';

import s from './ReplayUpload.module.scss';

export const ReplayUpload = () => {
  const t = useTranslations('replays.upload');
  const titleId = useId();
  const format = useFormatter();
  const {
    dropRef,
    isDragOver,
    file,
    problem,
    phase,
    progress,
    visibility,
    uploadedId,
    uploadError,
    parseError,
    maxMegabytes,
    setVisibility,
    onInputChange,
    start,
    reset
  } = useReplayUpload();

  return (
    <Card aria-labelledby={titleId} padding='none'>
      <CardHeader title={<span id={titleId}>{t('title')}</span>} />
      <CardBody className={s.body}>
        <CommunityGate requiresLesta={false}>
          <label ref={dropRef} className={s.drop} data-over={isDragOver}>
            <input accept={REPLAY_UPLOAD.accept} className={s.input} disabled={phase === 'uploading'} type='file' onChange={onInputChange} />
            <FileUp aria-hidden size={22} />
            <span className={s.dropTitle}>{t('dropTitle')}</span>
            <span className={s.dropHint}>{t('dropHint', { extensions: REPLAY_UPLOAD.extensions.join(', '), size: maxMegabytes })}</span>
          </label>
          {file && (
            <div className={s.file}>
              <span className={s.fileName}>{file.name}</span>
              <span className={s.fileSize}>
                {t('size', { size: format.number(file.size / REPLAY_UPLOAD.bytesPerMegabyte, { maximumFractionDigits: 1 }) })}
              </span>
            </div>
          )}
          {problem && (
            <p className={s.error} role='alert'>
              {t(`problems.${problem}`, { size: maxMegabytes })}
            </p>
          )}
          <SegmentedControl<UploadVisibility>
            aria-label={t('visibility')}
            options={REPLAY_VISIBILITIES.map((value) => ({ value, label: t(`visibilities.${value}`) }))}
            size='sm'
            value={visibility}
            onChange={setVisibility}
          />
          <p className={s.hint}>{t(`visibilityHints.${visibility}`)}</p>
          {phase === 'selected' && (
            <Button block onClick={start}>
              {t('start')}
            </Button>
          )}
          {phase === 'uploading' && (
            <ProgressBar
              label={t('uploading')}
              max={100}
              value={Math.round(progress * 100)}
              valueLabel={format.number(progress, { style: 'percent' })}
            />
          )}
          {phase === 'processing' && (
            <p aria-live='polite' className={s.status}>
              {t('processing')}
            </p>
          )}
          <UploadOutcome parseError={parseError} phase={phase} uploadedId={uploadedId} uploadError={uploadError} onReset={reset} />
        </CommunityGate>
      </CardBody>
    </Card>
  );
};
