'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, CopyField } from '@/ui-kit';

import type { CodeProofProps } from './CodeProof.types';

import { CLAIM_PROFILE } from '../../../config';
import { ProofCard } from '../ProofCard';

import s from './CodeProof.module.scss';

export const CodeProof = ({ code, isStarting, isVerifying, onStart, onVerify }: CodeProofProps) => {
  const t = useTranslations('streamersDirectory.claim.code');

  return (
    <ProofCard description={t('description')} title={t('title')}>
      {code ? (
        <>
          <CopyField label={t('code')} tone='accent' value={code} />
          <div className={s.actions}>
            <Button disabled={isVerifying} size='sm' onClick={onVerify}>
              <RefreshCw size={CLAIM_PROFILE.iconSize} />
              {t('verify')}
            </Button>
          </div>
        </>
      ) : (
        <div className={s.actions}>
          <Button disabled={isStarting} size='sm' variant='secondary' onClick={onStart}>
            {t('start')}
          </Button>
        </div>
      )}
    </ProofCard>
  );
};
