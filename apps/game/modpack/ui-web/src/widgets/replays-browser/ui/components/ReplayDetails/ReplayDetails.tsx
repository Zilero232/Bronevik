import clsx from 'clsx';

import type { ReplayDetailsProps } from './ReplayDetails.types';

import { formatCount, formatDuration, formatMoment, formatSize, romanTier } from '../../../../../entities/replays';
import { KEYS, WHEEL_SCROLL_PROPS } from '../../../../../shared/config';
import { Button } from '../../../../../shared/ui/button';
import { ClientIcon } from '../../../../../shared/ui/hud/ClientIcon';
import { REPLAYS_BROWSER } from '../../../config';
import { useReplaysT } from '../../../model/hooks';
import { ReplayIcon } from '../ReplayIcon';
import { StatTile } from '../StatTile';

import s from './ReplayDetails.module.scss';

export const ReplayDetails = ({ item, browser }: ReplayDetailsProps) => {
  const t = useReplaysT();
  const upload = browser.page?.upload ?? 'missing';
  const client = browser.page?.client ?? '';
  const tier = romanTier(item.tier);
  const outcome = item.result ?? 'unknown';
  const accuracy = [item.shots, item.hits, item.pens].map(formatCount).join(' / ');
  const uploadHintKey = item.arena === null ? 'uploadNoArena' : REPLAYS_BROWSER.uploadHints[upload];
  const uploadHint = uploadHintKey === null ? null : t(uploadHintKey);
  const stats = [
    { key: 'damage', label: t('damage'), value: formatCount(item.damage), accent: true },
    { key: 'assist', label: t('assist'), value: formatCount(item.assist) },
    { key: 'kills', label: t('kills'), value: formatCount(item.kills) },
    { key: 'spotted', label: t('spotted'), value: formatCount(item.spotted) },
    { key: 'xp', label: t('xp'), value: formatCount(item.xp) },
    { key: 'credits', label: t('credits'), value: formatCount(item.credits) },
    { key: 'shots', label: `${t('shots')} / ${t('hits')} / ${t('pens')}`, value: accuracy, wide: true },
    { key: 'received', label: t('received'), value: formatCount(item.received) },
    { key: 'blocked', label: t('blocked'), value: formatCount(item.blocked) },
    { key: 'duration', label: t('duration'), value: formatDuration(item.duration) },
    { key: 'lifeTime', label: t('lifeTime'), value: formatDuration(item.life_time) }
  ];

  return (
    <aside aria-label={item.title} className={s.details}>
      <div className={s.hero}>
        {item.map_image ? <img alt='' className={s.heroImage} src={item.map_image} /> : <span className={s.heroEmpty} />}
        <span className={s.heroShade} />
        <span className={s.heroText}>
          <span className={clsx(s.outcome, s[outcome])}>{t(`outcome_${outcome}`)}</span>
          <span className={s.heroMap}>{item.map_title ?? item.map ?? item.title}</span>
          <span className={s.heroMeta}>{`${t(`type_${item.type}`)} · ${formatMoment(item.time)}`}</span>
        </span>
      </div>
      <div className={s.scroll} {...WHEEL_SCROLL_PROPS}>
        <div className={s.vehicle}>
          {item.tank_image && <img alt='' className={s.vehicleImage} src={item.tank_image} />}
          <span className={s.vehicleText}>
            <span className={s.vehicleName}>
              {tier && <span className={s.tier}>{tier}</span>}
              {item.tank ?? item.vehicle ?? item.title}
            </span>
            {item.survived !== null && (
              <span className={clsx(s.fate, item.survived ? s.alive : s.dead)}>{item.survived ? t('survived') : t('destroyed')}</span>
            )}
          </span>
          {item.mastery_image && <ClientIcon className={s.mastery} icon={item.mastery_image} size={32} />}
        </div>
        {item.result === null ? (
          <p className={s.note}>{t('noResults')}</p>
        ) : (
          <div className={s.stats}>
            {stats.map((stat) => (
              <StatTile key={stat.key} accent={stat.accent} label={stat.label} value={stat.value} wide={stat.wide} />
            ))}
          </div>
        )}
        <div className={s.actions}>
          {!item.playable && <p className={s.warning}>{t('watchVersion', { version: item.version ?? '?', client: client || '?' })}</p>}
          <Button
            className={clsx(s.watch, !item.playable && s.watchOff)}
            disabled={!item.playable}
            variant='accent'
            onClick={() => browser.askWatch(item)}
          >
            <ReplayIcon className={s.buttonIcon} name='play' size={18} />
            {t('watch')}
          </Button>
          {browser.pending === 'watch' && (
            <div className={s.confirm} role='alert'>
              <span className={s.confirmText}>{t('watchConfirm')}</span>
              <span className={s.confirmButtons}>
                <Button className={s.confirmButton} size='small' variant='accent' onClick={browser.confirm}>
                  {t('watch')}
                </Button>
                <Button className={s.confirmButton} size='small' variant='ghost' onClick={browser.cancel}>
                  {t('cancel')}
                </Button>
              </span>
            </div>
          )}
          {item.site ? (
            <div className={s.site}>
              <span className={clsx(s.siteState, s[item.site.state])}>{t(`site_${item.site.state}`)}</span>
              {item.site.link && (
                <Button className={s.siteLink} size='small' variant='ghost' onClick={() => browser.openSite(item)}>
                  <ReplayIcon className={s.buttonIcon} name='external' size={14} />
                  {t('openOnSite')}
                </Button>
              )}
            </div>
          ) : (
            <>
              <Button className={s.upload} disabled={uploadHint !== null} onClick={() => browser.upload(item)}>
                <ReplayIcon className={s.buttonIcon} name='upload' size={16} />
                {t('upload')}
              </Button>
              {uploadHint && <p className={s.hint}>{uploadHint}</p>}
            </>
          )}
          <div className={s.tools}>
            <Button
              className={clsx(s.tool, item.favourite && s.favourite)}
              size='small'
              variant='ghost'
              onClick={() => browser.toggleFavourite(item)}
            >
              <ReplayIcon className={s.buttonIcon} name='star' size={14} />
              {item.favourite ? t('favouriteRemove') : t('favouriteAdd')}
            </Button>
            <Button className={s.tool} size='small' variant='ghost' onClick={() => browser.startRename(item)}>
              <ReplayIcon className={s.buttonIcon} name='pencil' size={14} />
              {t('rename')}
            </Button>
            <Button className={clsx(s.tool, s.remove)} size='small' variant='ghost' onClick={() => browser.askRemove(item)}>
              <ReplayIcon className={s.buttonIcon} name='trash' size={14} />
              {t('remove')}
            </Button>
          </div>
          {browser.draft !== null && (
            <div className={s.rename}>
              <input
                aria-label={t('rename')}
                className={s.renameInput}
                maxLength={REPLAYS_BROWSER.renameMaxLength}
                type='text'
                value={browser.draft}
                onInput={(event) => browser.editRename(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === KEYS.enter) {
                    browser.submitRename();
                  }
                }}
              />
              <Button className={s.confirmButton} size='small' variant='accent' onClick={browser.submitRename}>
                {t('renameSave')}
              </Button>
              <Button className={s.confirmButton} size='small' variant='ghost' onClick={browser.cancelRename}>
                {t('cancel')}
              </Button>
            </div>
          )}
          {browser.pending === 'remove' && (
            <div className={clsx(s.confirm, s.confirmDanger)} role='alert'>
              <span className={s.confirmText}>
                {t('removeConfirm', { name: [item.tank, item.map_title, formatMoment(item.time)].filter(Boolean).join(', ') })}
              </span>
              <span className={s.confirmButtons}>
                <Button className={s.confirmButton} size='small' variant='danger' onClick={browser.confirm}>
                  {t('remove')}
                </Button>
                <Button className={s.confirmButton} size='small' variant='ghost' onClick={browser.cancel}>
                  {t('cancel')}
                </Button>
              </span>
            </div>
          )}
        </div>
        <p className={s.file}>
          {item.id}
          <span className={s.fileMeta}>{`${formatSize(item.size)} ${t('size')} · ${t('version')} ${item.version ?? '?'}`}</span>
        </p>
      </div>
    </aside>
  );
};
