import { Lock, PlayCircle, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ComponentToggle } from '@/features/component/component-toggle';
import { Badge, ExternalLink } from '@/ui-kit';

import type { ComponentCardProps } from './ComponentCard.types';

import { COMPONENT_CATALOG } from '../../../config';

import s from './ComponentCard.module.scss';

export const ComponentCard = ({ clientPath, isInstalled, row }: ComponentCardProps) => {
  const t = useTranslations('components');

  return (
    <article className={s.root} data-state={row.state}>
      <div className={s.preview}>{row.previewSrc && <img alt='' className={s.image} src={row.previewSrc} />}</div>
      <div className={s.body}>
        <header className={s.header}>
          <h3 className={s.title}>{row.title}</h3>
          <Badge tone={COMPONENT_CATALOG.stateTones[row.state]}>{t(`state.${row.state}`)}</Badge>
          {row.required && (
            <Badge icon={<Lock aria-hidden />} tone='accent'>
              {t('required')}
            </Badge>
          )}
        </header>
        <p className={s.description}>{row.description}</p>
        {row.fairPlay && (
          <p className={s.fairPlay}>
            <ShieldCheck aria-hidden />
            <span>
              <strong>{t('fairPlay')}:</strong> {row.fairPlay}
            </span>
          </p>
        )}
        <footer className={s.footer}>
          {row.dependencies.length > 0 && <span className={s.dependencies}>{t('dependencies', { list: row.dependencies.join(', ') })}</span>}
          {row.video && (
            <ExternalLink href={row.video}>
              <PlayCircle aria-hidden />
              {t('video')}
            </ExternalLink>
          )}
        </footer>
      </div>
      <div className={s.toggle}>
        <ComponentToggle
          checked={row.state === 'enabled'}
          clientPath={clientPath}
          componentId={row.id}
          disabled={!isInstalled || row.required}
          title={row.title}
        />
      </div>
    </article>
  );
};
