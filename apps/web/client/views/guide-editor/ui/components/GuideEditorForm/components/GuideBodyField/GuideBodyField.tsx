'use client';

import { useTranslations } from 'next-intl';

import { Markdown } from '@/features/community/markdown';
import { FormField, Tabs, Textarea } from '@/ui-kit';

import { useGuideBodyField } from '../../../../../model/hooks';

import s from './GuideBodyField.module.scss';

export const GuideBodyField = () => {
  const t = useTranslations('guides.editor');
  const { body, hasPreview, length, max, min, rows, isInvalid, field } = useGuideBodyField();

  return (
    <FormField error={isInvalid && t('errors.body', { min, max: max ?? length })} hint={t('markdownHint')} label={t('body')}>
      <Tabs
        aside={
          <span className={s.counter} data-over={max !== undefined && length > max}>
            {t('counter', { length, max: max ?? length })}
          </span>
        }
        items={[
          {
            value: 'write',
            label: t('write'),
            content: (
              <Textarea
                aria-label={t('body')}
                className={s.textarea}
                isInvalid={isInvalid}
                placeholder={t('bodyPlaceholder')}
                rows={rows}
                {...field}
              />
            )
          },
          {
            value: 'preview',
            label: t('preview'),
            content: hasPreview ? <Markdown className={s.preview}>{body}</Markdown> : <p className={s.empty}>{t('previewEmpty')}</p>
          }
        ]}
      />
    </FormField>
  );
};
