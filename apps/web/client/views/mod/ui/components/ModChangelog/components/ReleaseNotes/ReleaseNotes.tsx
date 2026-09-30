import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { ReleaseNotesProps } from './ReleaseNotes.types';

import s from './ReleaseNotes.module.scss';

export const ReleaseNotes = ({ release }: ReleaseNotesProps) => {
  const t = useTranslations('mod.changelog');

  return (
    <article className={s.root}>
      <header className={s.head}>
        <h3 className={s.version}>{t('version', { version: release.version })}</h3>
        <Badge tone='steel'>{t('games', { games: release.games })}</Badge>
      </header>
      {release.summary.map((paragraph) => (
        <p key={paragraph} className={s.summary}>
          {paragraph}
        </p>
      ))}
      {release.items.length > 0 && (
        <ul className={s.items}>
          {release.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {release.changed.length > 0 && (
        <p className={s.changed}>
          <span className={s.changedLabel}>{t('changed')}</span>
          {release.changed.join(', ')}
        </p>
      )}
    </article>
  );
};
