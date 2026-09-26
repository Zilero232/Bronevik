'use client';

import { ArrowRight, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { ClaimProfileProps } from './ClaimProfile.types';

import { CLAIM_PROFILE } from '../config';
import { useClaimProfile } from '../model/hooks';
import { ClaimStatus, CodeProof, ManualProof, OauthProof } from './components';

import s from './ClaimProfile.module.scss';

export const ClaimProfile = ({ slug }: ClaimProfileProps) => {
  const t = useTranslations('streamersDirectory.claim');
  const claim = useClaimProfile(slug);

  return match(claim.view)
    .with('pending', () => <Skeleton height={CLAIM_PROFILE.skeletonHeight} shape='block' />)
    .with('signIn', () => (
      <Card>
        <EmptyState
          action={
            <Link className={buttonVariants({ size: 'sm' })} href={ROUTES.auth.login}>
              <LogIn size={CLAIM_PROFILE.iconSize} />
              {t('signIn.action')}
            </Link>
          }
          description={t('signIn.description')}
          title={t('signIn.title')}
        />
      </Card>
    ))
    .with('missing', () => (
      <Card>
        <EmptyState
          action={
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.streamers.list}>
              {t('missing.action')}
            </Link>
          }
          description={t('missing.description')}
          title={t('missing.title')}
        />
      </Card>
    ))
    .with('failed', () => (
      <ErrorState description={t('error.description')} isRetrying={claim.isRetrying} title={t('error.title')} onRetry={claim.retry} />
    ))
    .with('ready', () =>
      claim.stage === 'resolved' ? (
        <Card>
          <EmptyState
            action={
              <Link className={buttonVariants({ size: 'sm' })} href={ROUTES.account.streamer}>
                {t('resolved.action')}
                <ArrowRight size={CLAIM_PROFILE.iconSize} />
              </Link>
            }
            description={t('resolved.description')}
            title={t('resolved.title')}
          />
        </Card>
      ) : (
        <div className={s.root}>
          {claim.claim && <ClaimStatus claim={claim.claim} />}
          {claim.stage !== 'review' && (
            <section aria-label={t('proofs')} className={s.proofs}>
              <OauthProof isPending={claim.startingMethod === 'oauth'} login={claim.twitchLogin} onClaim={claim.onOauth} />
              <CodeProof
                code={claim.stage === 'code' ? claim.claim?.code : null}
                isStarting={claim.startingMethod === 'bio_code'}
                isVerifying={claim.isVerifying}
                onStart={claim.onCode}
                onVerify={claim.onVerify}
              />
              <ManualProof slug={slug} />
            </section>
          )}
        </div>
      )
    )
    .exhaustive();
};
