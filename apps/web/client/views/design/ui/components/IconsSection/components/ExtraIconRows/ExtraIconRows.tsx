'use client';

import { MarkOfExcellenceIcon, MasteryIcon, NATION_ICONS, NATIONS, TierIcon, TIERS } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import type { ExtraIconRowsProps } from './ExtraIconRows.types';

import { DESIGN_ICONS } from '../../../../../config';
import { DesignRow } from '../../../DesignRow';
import { IconCell } from '../IconCell';

export const ExtraIconRows = ({ iconProps }: ExtraIconRowsProps) => {
  const t = useTranslations('design.icons');
  const tGame = useTranslations('game');
  const tMastery = useTranslations('profile.awards.mastery');

  return (
    <>
      <DesignRow label={t('groups.nationsColor')}>
        {NATIONS.map((nation) => {
          const Icon = NATION_ICONS[nation];

          return (
            <IconCell key={nation} name={nation} title={tGame(`nations.${nation}`)}>
              <Icon palette='color' {...iconProps} />
            </IconCell>
          );
        })}
      </DesignRow>
      <DesignRow label={t('groups.masteryTinted')}>
        {DESIGN_ICONS.masteryLevels.map((level) => (
          <IconCell key={level} title={tMastery(level)}>
            <MasteryIcon tinted level={level} {...iconProps} />
          </IconCell>
        ))}
      </DesignRow>
      <DesignRow label={t('groups.marksRings')}>
        {DESIGN_ICONS.markCounts.map((marks) => (
          <IconCell key={marks}>
            <MarkOfExcellenceIcon marks={marks} markStyle='rings' {...iconProps} />
          </IconCell>
        ))}
      </DesignRow>
      <DesignRow label={t('groups.tiers')}>
        {TIERS.map((tier) => (
          <IconCell key={tier}>
            <TierIcon {...iconProps} tier={tier} />
          </IconCell>
        ))}
      </DesignRow>
      <DesignRow label={t('groups.tiersEngraved')}>
        {TIERS.map((tier) => (
          <IconCell key={tier}>
            <TierIcon engraved {...iconProps} tier={tier} />
          </IconCell>
        ))}
      </DesignRow>
    </>
  );
};
