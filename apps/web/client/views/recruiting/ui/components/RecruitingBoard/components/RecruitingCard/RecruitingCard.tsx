'use client';

import { useTranslations } from 'next-intl';

import { ContactPlayer } from '@/features/community/contact-player';
import { PlayerStatsLine } from '@/features/community/player-stats';
import { RequirementsList } from '@/features/community/stat-requirements';
import { Link } from '@/shared/i18n/navigation';
import { Button, Card, RelativeTime } from '@/ui-kit';

import type { RecruitingCardProps } from './RecruitingCard.types';

import { useRecruitingCard } from '../../../../../model/hooks';

import s from './RecruitingCard.module.scss';

export const RecruitingCard = ({ post }: RecruitingCardProps) => {
  const t = useTranslations('recruiting.card');
  const { isClan, clanHref, profileHref, canClose, isClosing, onClose } = useRecruitingCard(post);

  return (
    <Card className={s.root} padding='sm'>
      <header className={s.head}>
        {isClan && clanHref && (
          <Link className={s.tag} href={clanHref}>
            [{post.clanTag}]
          </Link>
        )}
        {!isClan && profileHref && (
          <Link className={s.nick} href={profileHref}>
            {post.nickname ?? t('unknownNick')}
          </Link>
        )}
        <span className={s.meta}>
          <RelativeTime value={post.createdAt} />
          {post.expiresAt && (
            <>
              {' · '}
              {t('expires')} <RelativeTime value={post.expiresAt} />
            </>
          )}
        </span>
      </header>
      <h3 className={s.title}>{post.title}</h3>
      {!isClan && <PlayerStatsLine stats={post.stats} />}
      <p className={s.body}>{post.body}</p>
      {isClan && <RequirementsList requirements={post.requirements} />}
      <footer className={s.foot}>
        {!isClan && post.accountId !== null && <ContactPlayer accountId={post.accountId} nickname={post.nickname} />}
        {isClan && clanHref && (
          <Link className={s.clanLink} href={clanHref}>
            {t('clanPage')}
          </Link>
        )}
        {canClose && (
          <Button disabled={isClosing} size='sm' variant='ghost' onClick={onClose}>
            {t('close')}
          </Button>
        )}
      </footer>
    </Card>
  );
};
