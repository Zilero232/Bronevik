import { UserRoundCog } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ProfileActions } from '@/features/profile/profile-actions';
import { Badge, Card, EmptyState, QueryState } from '@/ui-kit';

import { useProfileList } from '../model/hooks';

import s from './ProfileList.module.scss';

export const ProfileList = () => {
  const t = useTranslations();
  const { clientPath, profilesQuery, count, max, rows } = useProfileList();

  return (
    <Card actions={max > 0 && <Badge>{t('profiles.count', { count, max })}</Badge>} title={t('profiles.title')}>
      <QueryState errorTitle={t('common.loadFailed')} loadingLabel={t('common.loading')} query={profilesQuery} retryLabel={t('common.retry')}>
        {() =>
          rows.length > 0 ? (
            <ul className={s.list}>
              {rows.map(({ profile, updated }) => (
                <li key={profile.id} className={s.row} data-active={profile.active || undefined}>
                  <div className={s.text}>
                    <span className={s.name}>
                      {profile.name}
                      {profile.active && <Badge tone='accent'>{t('profiles.active')}</Badge>}
                    </span>
                    {updated && <span className={s.meta}>{t('profiles.updated', { date: updated })}</span>}
                  </div>
                  <ProfileActions clientPath={clientPath} profile={profile} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState hint={t('profiles.emptyHint')} icon={<UserRoundCog />} title={t('profiles.empty')} />
          )
        }
      </QueryState>
    </Card>
  );
};
