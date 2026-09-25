'use client';

import type { RecentPeriod } from '@bronevik/schemas';

import { CrosshairIcon, HeavyTankIcon, NATION_ICONS, NATIONS } from '@bronevik/icons';
import { useBoolean } from '@siberiacancode/reactuse';
import { Bell, Crosshair, Search, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PeriodSwitcher } from '@/features/stats/select-period';
import { MOCK_PLAYERS } from '@/shared/mocks';
import { Avatar, Badge, Button, IconButton, Input, Kbd, Select, Switch, Tabs } from '@/ui-kit';

import { DesignBlock, DesignRow } from '../DesignBlock';

import s from './ControlsSection.module.scss';

export const ControlsSection = () => {
  const t = useTranslations('design.controls');
  const tGame = useTranslations('game');
  const [period, setPeriod] = useState<RecentPeriod>('7d');
  const [nation, setNation] = useState<(typeof NATIONS)[number]>('ussr');
  const [isOn, toggleOn] = useBoolean(true);

  return (
    <DesignBlock eyebrow='04' id='controls' title={t('title')}>
      <DesignRow label={t('buttons')}>
        <Button>{t('primary')}</Button>
        <Button variant='secondary'>{t('secondary')}</Button>
        <Button variant='ghost'>{t('ghost')}</Button>
        <Button variant='danger'>{t('danger')}</Button>
        <Button disabled>{t('disabled')}</Button>
        <Button size='sm'>{t('small')}</Button>
        <Button size='lg'>
          <HeavyTankIcon size={18} />
          {t('large')}
        </Button>
      </DesignRow>
      <DesignRow label={t('iconButtons')}>
        <IconButton aria-label={t('search')}>
          <Search size={18} />
        </IconButton>
        <IconButton aria-label={t('notifications')} variant='outline'>
          <Bell size={18} />
        </IconButton>
        <IconButton isActive aria-label={t('favorite')} variant='outline'>
          <Star size={18} />
        </IconButton>
        <IconButton aria-label={t('aim')} size='lg' variant='outline'>
          <CrosshairIcon size={22} />
        </IconButton>
      </DesignRow>
      <DesignRow label={t('badges')}>
        {(['neutral', 'accent', 'steel', 'success', 'warning', 'danger', 'solid'] as const).map((tone) => (
          <Badge key={tone} tone={tone}>
            {tone}
          </Badge>
        ))}
      </DesignRow>
      <DesignRow className={s.inputs} label={t('inputs')}>
        <Input icon={<Crosshair size={16} />} placeholder={t('placeholder')} trailing={<Kbd>/</Kbd>} />
        <Input isInvalid defaultValue='Stalevar_1987!' size='sm' />
        <Select
          items={NATIONS.map((value) => {
            const Icon = NATION_ICONS[value];

            return { value, label: tGame(`nations.${value}`), icon: <Icon palette='color' size={16} /> };
          })}
          label={t('nation')}
          value={nation}
          onValueChange={setNation}
        />
      </DesignRow>
      <DesignRow label={t('segmented')}>
        <PeriodSwitcher value={period} onChange={setPeriod} />
        <PeriodSwitcher size='sm' value={period} onChange={setPeriod} />
      </DesignRow>
      <DesignRow className={s.switch} label={t('switch')}>
        <Switch checked={isOn} description={t('switchHint')} label={t('switchLabel')} onCheckedChange={toggleOn} />
      </DesignRow>
      <DesignRow className={s.tabs} label={t('tabs')}>
        <Tabs
          items={[
            { value: 'overview', label: t('tabOverview'), content: <p className={s.tabBody}>{t('tabOverviewBody')}</p> },
            { value: 'tanks', label: t('tabTanks'), count: 412, content: <p className={s.tabBody}>{t('tabTanksBody')}</p> },
            { value: 'marks', label: t('tabMarks'), count: 212, content: <p className={s.tabBody}>{t('tabMarksBody')}</p> }
          ]}
        />
      </DesignRow>
      <DesignRow label={t('avatars')}>
        {MOCK_PLAYERS.slice(0, 5).map((player, index) => (
          <Avatar key={player.id} name={player.nickname} size={index === 0 ? 'lg' : 'md'} />
        ))}
      </DesignRow>
    </DesignBlock>
  );
};
