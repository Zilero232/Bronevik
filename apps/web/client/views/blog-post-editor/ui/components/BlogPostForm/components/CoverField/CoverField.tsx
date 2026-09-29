'use client';

import { ImageUp, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useId } from 'react';

import { Button, Card, FormField, Input } from '@/ui-kit';

import type { CoverFieldProps } from './CoverField.types';

import { BLOG_POST_FORM } from '../../../../../config';

import s from './CoverField.module.scss';

export const CoverField = ({ preview, hasUploadedCover, isUploading, isInvalid, urlField, onFile, onRemove }: CoverFieldProps) => {
  const t = useTranslations('blog.editor.form');
  const fileId = useId();

  return (
    <Card className={s.root} padding='lg'>
      <p className={s.label}>{t('cover')}</p>
      <div className={s.preview}>
        {preview ? (
          <Image fill unoptimized alt='' className={s.image} referrerPolicy='no-referrer' sizes='20rem' src={preview} />
        ) : (
          <span className={s.placeholder}>{t('coverEmpty')}</span>
        )}
      </div>
      <div className={s.actions}>
        <label className={s.upload} data-busy={isUploading} htmlFor={fileId}>
          <ImageUp aria-hidden size={14} />
          {isUploading ? t('coverUploading') : t('coverUpload')}
        </label>
        <input
          accept={BLOG_POST_FORM.upload.accept}
          className={s.file}
          disabled={isUploading}
          id={fileId}
          type='file'
          onChange={(event) => onFile(event.currentTarget.files?.[0])}
        />
        {preview && (
          <Button size='sm' type='button' variant='ghost' onClick={onRemove}>
            <Trash2 aria-hidden size={14} />
            {t('coverRemove')}
          </Button>
        )}
      </div>
      {!hasUploadedCover && (
        <FormField error={isInvalid && t('errors.coverUrl')} hint={t('coverUrlHint')} label={t('coverUrl')}>
          <Input isInvalid={isInvalid} placeholder={t('coverUrlPlaceholder')} type='url' {...urlField} />
        </FormField>
      )}
    </Card>
  );
};
