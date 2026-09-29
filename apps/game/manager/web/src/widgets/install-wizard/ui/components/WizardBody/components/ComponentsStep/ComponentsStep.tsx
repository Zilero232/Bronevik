import { FileInput, Gauge, PlayCircle, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { PERF } from '@/entities/catalog';
import { useInstallWizard } from '@/features/setup/install-modpack';
import { Badge, Button, Card, Checkbox, EmptyState, ExternalLink, FormField, Select } from '@/ui-kit';

import { DependencyList } from './components';

import s from './ComponentsStep.module.scss';

export const ComponentsStep = () => {
  const t = useTranslations();
  const { presetId, presetOptions, groups, preview, selectedCount, totalCount, isLoadingProfile, onPresetChange, onToggle, onFocus, onLoadProfile } =
    useInstallWizard();

  if (totalCount === 0) {
    return <EmptyState title={t('install.noCatalog')} />;
  }

  return (
    <Card
      actions={
        <Button isPending={isLoadingProfile} variant='ghost' onClick={onLoadProfile}>
          <FileInput aria-hidden />
          {t('install.loadProfile')}
        </Button>
      }
      title={t('install.steps.components')}
    >
      <div className={s.toolbar}>
        <FormField label={t('install.preset')}>
          {(control) => <Select {...control} options={presetOptions} value={presetId} onChange={(event) => onPresetChange(event.target.value)} />}
        </FormField>
        <Badge>{t('install.selectedCount', { count: selectedCount, total: totalCount })}</Badge>
      </div>
      <div className={s.layout}>
        <div className={s.tree}>
          {groups.map((group) => (
            <fieldset key={group.id} className={s.group}>
              <legend className={s.legend}>{group.title}</legend>
              {group.components.map((component) => (
                <div key={component.id} className={s.item} onFocus={() => onFocus(component.id)} onMouseEnter={() => onFocus(component.id)}>
                  <Checkbox
                    checked={component.checked}
                    description={component.required ? t('install.required') : undefined}
                    disabled={component.required}
                    label={component.title}
                    onCheckedChange={(checked) => onToggle({ id: component.id, checked })}
                  />
                </div>
              ))}
            </fieldset>
          ))}
          <DependencyList />
        </div>
        {preview && (
          <aside className={s.preview}>
            <div className={s.image}>{preview.src && <img alt='' src={preview.src} />}</div>
            <h3 className={s.previewTitle}>{preview.title}</h3>
            {preview.perf && (
              <Badge icon={<Gauge aria-hidden />} tone={PERF.tones[preview.perf]}>
                {t(`components.perf.${preview.perf}`)}
              </Badge>
            )}
            <p className={s.previewText}>{preview.description}</p>
            {preview.fairPlay && (
              <p className={s.fairPlay}>
                <ShieldCheck aria-hidden />
                {preview.fairPlay}
              </p>
            )}
            {preview.video && (
              <ExternalLink href={preview.video}>
                <PlayCircle aria-hidden />
                {t('components.video')}
              </ExternalLink>
            )}
            {preview.audioSrc && (
              <audio controls aria-label={t('components.listen', { title: preview.title })} className={s.audio} preload='none' src={preview.audioSrc}>
                <track kind='captions' />
              </audio>
            )}
          </aside>
        )}
      </div>
    </Card>
  );
};
