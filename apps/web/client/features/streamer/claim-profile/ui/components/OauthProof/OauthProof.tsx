'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { OauthProofProps } from './OauthProof.types';

import { CLAIM_PROFILE } from '../../../config';
import { ProofCard } from '../ProofCard';

import s from './OauthProof.module.scss';

export const OauthProof = ({ login, isPending, onClaim }: OauthProofProps) => {
  const t = useTranslations('streamersDirectory.claim.oauth');

  return (
    <ProofCard description={t('description')} title={t('title')}>
      <p className={s.state}>{login ? t('connected', { login }) : t('notConnected')}</p>
      <div className={s.actions}>
        {login ? (
          <Button disabled={isPending} size='sm' onClick={onClaim}>
            <ShieldCheck size={CLAIM_PROFILE.iconSize} />
            {t('action')}
          </Button>
        ) : (
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.streamer}>
            {t('connect')}
            <ArrowRight size={CLAIM_PROFILE.iconSize} />
          </Link>
        )}
      </div>
    </ProofCard>
  );
};
