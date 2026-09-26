'use client';

import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';

import type { AchievementSectionProps } from './AchievementSection.types';

import { ACHIEVEMENTS } from '../../../../../config';
import { knownSection } from '../../../../../lib/achievement-sections';
import { ProfilePanel } from '../../../ProfilePanel';

import s from './AchievementSection.module.scss';

export const AchievementSection = ({ section }: AchievementSectionProps) => {
  const t = useTranslations('profile.achievements.sections');
  const format = useFormatter();

  const known = knownSection(section.section);

  return (
    <ProfilePanel meta={format.number(section.items.length)} title={known ? t(known) : section.section}>
      <ul className={s.grid}>
        {section.items.map(({ name, title, description, image, count }) => (
          <li key={name} className={s.medal} title={description ? `${title} — ${description}` : title}>
            {image ? (
              <Image unoptimized alt={title} className={s.image} height={ACHIEVEMENTS.imageSize} src={image} width={ACHIEVEMENTS.imageSize} />
            ) : (
              <span aria-hidden className={s.placeholder} />
            )}
            <span className={s.title}>{title}</span>
            {count > 1 && <span className={s.count}>×{format.number(count)}</span>}
          </li>
        ))}
      </ul>
    </ProfilePanel>
  );
};
