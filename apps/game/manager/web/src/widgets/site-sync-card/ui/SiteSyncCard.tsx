import { useTranslations } from 'use-intl';

import { AccountSelect, LinkAccountForm } from '@/features/site-sync/link-account';
import { SyncNowButton } from '@/features/site-sync/sync-now';
import { useQueryLabels } from '@/shared/lib';
import { Badge, Button, Card, QueryState } from '@/ui-kit';

import { useSiteSyncCard } from '../model/hooks';

import s from './SiteSyncCard.module.scss';

export const SiteSyncCard = () => {
  const t = useTranslations('sync');
  const queryLabels = useQueryLabels();
  const { linkQuery, isLinked, hasChoice, account, isLinkFormOpen, lines, onToggleLinkForm } = useSiteSyncCard();

  return (
    <Card actions={isLinked && <SyncNowButton />} description={t('description')} title={t('title')}>
      <QueryState {...queryLabels} query={linkQuery}>
        {() => (
          <div className={s.body}>
            {isLinked && (
              <div className={s.account}>
                <span className={s.label}>{t('account')}</span>
                {hasChoice ? <AccountSelect /> : <span>{account}</span>}
              </div>
            )}
            {isLinked && (
              <ul className={s.lines}>
                {lines.map((line) => (
                  <li key={line.library} className={s.line}>
                    <span className={s.lineLabel}>{line.label}</span>
                    <span className={s.meta}>{line.text}</span>
                    {line.pending && <Badge tone='accent'>{line.pending}</Badge>}
                  </li>
                ))}
              </ul>
            )}
            {isLinked && (
              <Button className={s.toggle} size='sm' variant='ghost' onClick={onToggleLinkForm}>
                {isLinkFormOpen ? t('hideLink') : t('linkAnother')}
              </Button>
            )}
            {isLinkFormOpen && <LinkAccountForm />}
            <p className={s.privacy}>{t('privacy')}</p>
          </div>
        )}
      </QueryState>
    </Card>
  );
};
