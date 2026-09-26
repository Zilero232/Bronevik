'use client';

import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';

import type { AchievementSectionProps } from './AchievementSection.types';

import { ACHIEVEMENTS } from '../../../../../config';
import { knownSection } from '../../../../../lib/achievement-sections';
import { ProfilePanel } from '../../../ProfilePanel';

import s from './AchievementSection.module.scss';

export const AchievementSection = ({ section, isFeatured }: AchievementSectionProps) => {
  const t = useTranslations('profile.achievements.sections');
  const format = useFormatter();

  const known = knownSection(section.section);
  const size = isFeatured ? ACHIEVEMENTS.featuredImageSize : ACHIEVEMENTS.imageSize;

  return (
    <ProfilePanel meta={format.number(section.items.length)} title={known ? t(known) : section.section}>
      <ul className={s.grid} data-featured={isFeatured || undefined}>
        {section.items.map(({ name, title, description, image, count }) => (
          <li key={name} className={s.medal} title={description ? `${title} — ${description}` : title}>
            <span className={s.frame}>
              {image ? (
                <Image unoptimized alt={title} className={s.image} height={size} src={image} width={size} />
              ) : (
                <span aria-hidden className={s.placeholder} />
              )}
              {count > 1 && <span className={s.count}>×{format.number(count)}</span>}
            </span>
            <span className={s.title}>{title}</span>
          </li>
        ))}
      </ul>
    </ProfilePanel>
  );
};
