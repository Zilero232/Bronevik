import clsx from 'clsx';

import type { ReplayRowProps } from './ReplayRow.types';

import { formatCount, formatMoment, romanTier } from '../../../../../entities/replays';
import { ClientIcon } from '../../../../../shared/ui/hud/ClientIcon';
import { useReplaysT } from '../../../model/hooks';
import { ReplayIcon } from '../ReplayIcon';

import s from './ReplayRow.module.scss';

export const ReplayRow = ({ item, top, height, selected, onSelect }: ReplayRowProps) => {
  const t = useReplaysT();
  const tier = romanTier(item.tier);

  return (
    <button
      aria-pressed={selected}
      className={clsx(s.row, selected && s.rowOn)}
      style={{ top: `${top}rem`, height: `${height}rem` }}
      type='button'
      onClick={() => onSelect(item.id)}
    >
      <span className={clsx(s.stripe, item.result && s[item.result])} />
      <span className={s.media}>
        {item.map_thumb ? <img alt='' className={s.map} src={item.map_thumb} /> : <span className={s.mapEmpty} />}
        {item.tank_image && <img alt='' className={s.tank} src={item.tank_image} />}
      </span>
      <span className={s.main}>
        <span className={s.title}>
          {tier && <span className={s.tier}>{tier}</span>}
          <span className={s.tankName}>{item.tank ?? item.title}</span>
          {item.mastery_image && <ClientIcon className={s.mastery} icon={item.mastery_image} size={16} />}
        </span>
        <span className={s.meta}>{[item.map_title, t(`type_${item.type}`), formatMoment(item.time)].filter(Boolean).join(' · ')}</span>
      </span>
      <span className={s.numbers}>
        <span className={clsx(s.damage, item.damage === null && s.unknown)}>{formatCount(item.damage)}</span>
        <span className={s.minor}>
          {item.result === null
            ? t('outcome_unknown')
            : `${t('assistShort')} ${formatCount(item.assist)} · ${t('killsShort')} ${formatCount(item.kills)}`}
        </span>
      </span>
      <span className={s.marks}>
        {item.site && <span className={clsx(s.site, s[item.site.state])}>{t(`site_${item.site.state}`)}</span>}
        {!item.playable && <span className={s.version}>{item.version ?? '?'}</span>}
        {item.favourite && <ReplayIcon className={s.star} name='star' size={14} />}
      </span>
    </button>
  );
};
