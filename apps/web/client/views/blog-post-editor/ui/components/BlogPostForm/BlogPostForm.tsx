'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { MarkdownEditor } from '@/features/community/markdown-editor';
import { Button, Card, FormField, Input, SegmentedControl, Select, Switch, Textarea } from '@/ui-kit';

import type { BlogPostFormProps } from './BlogPostForm.types';

import { BLOG_POST_FORM } from '../../../config';
import { useBlogPostForm } from '../../../model/hooks';
import { CoverField } from './components';

import s from './BlogPostForm.module.scss';

export const BlogPostForm = ({ post }: BlogPostFormProps) => {
  const t = useTranslations('blog.editor.form');
  const fieldId = useId();
  const editor = useBlogPostForm(post);

  const { errors } = editor.form.formState;

  return (
    <form noValidate className={s.root} onSubmit={editor.onSaveDraft}>
      <div className={s.layout}>
        <Card className={s.main} padding='lg'>
          <FormField
            error={errors.title && t('errors.title', { min: BLOG_POST_FORM.titleMin, max: BLOG_POST_FORM.titleMax ?? editor.titleLength })}
            hint={t('counter', { length: editor.titleLength, max: BLOG_POST_FORM.titleMax ?? editor.titleLength })}
            htmlFor={`${fieldId}-title`}
            label={t('title')}
          >
            <Input
              id={`${fieldId}-title`}
              isInvalid={Boolean(errors.title)}
              maxLength={BLOG_POST_FORM.titleMax}
              placeholder={t('titlePlaceholder')}
              {...editor.form.register('title')}
            />
          </FormField>
          <FormField
            error={errors.excerpt && t('errors.excerpt', { min: BLOG_POST_FORM.excerptMin, max: BLOG_POST_FORM.excerptMax ?? editor.excerptLength })}
            hint={t('counter', { length: editor.excerptLength, max: BLOG_POST_FORM.excerptMax ?? editor.excerptLength })}
            htmlFor={`${fieldId}-excerpt`}
            label={t('excerpt')}
          >
            <Textarea
              id={`${fieldId}-excerpt`}
              isInvalid={Boolean(errors.excerpt)}
              maxLength={BLOG_POST_FORM.excerptMax}
              placeholder={t('excerptPlaceholder')}
              rows={3}
              {...editor.form.register('excerpt')}
            />
          </FormField>
          <FormField error={errors.body && t('errors.body')} hint={t('bodyHint')} label={t('body')}>
            <Controller
              render={({ field, fieldState }) => (
                <MarkdownEditor
                  isInvalid={fieldState.invalid}
                  markdown={field.value}
                  placeholder={t('bodyPlaceholder')}
                  onChange={field.onChange}
                  onImageUpload={editor.onImageUpload}
                />
              )}
              control={editor.form.control}
              name='body'
            />
          </FormField>
        </Card>
        <div className={s.side}>
          <Card className={s.panel} padding='lg'>
            <FormField label={t('category')}>
              <Controller
                render={({ field }) => (
                  <Select aria-label={t('category')} items={editor.categoryItems} value={field.value} onValueChange={field.onChange} />
                )}
                control={editor.form.control}
                name='category'
              />
            </FormField>
            <FormField label={t('locale')}>
              <Controller
                render={({ field }) => (
                  <SegmentedControl aria-label={t('locale')} options={editor.localeOptions} size='sm' value={field.value} onChange={field.onChange} />
                )}
                control={editor.form.control}
                name='locale'
              />
            </FormField>
            <FormField error={errors.tags && t('errors.tags')} hint={t('tagsHint')} htmlFor={`${fieldId}-tags`} label={t('tags')}>
              <Input id={`${fieldId}-tags`} isInvalid={Boolean(errors.tags)} placeholder={t('tagsPlaceholder')} {...editor.form.register('tags')} />
            </FormField>
            <Controller
              render={({ field }) => (
                <Switch checked={field.value} description={t('featuredHint')} label={t('featured')} onCheckedChange={field.onChange} />
              )}
              control={editor.form.control}
              name='isFeatured'
            />
          </Card>
          <CoverField
            hasUploadedCover={editor.hasUploadedCover}
            isInvalid={Boolean(errors.coverUrl)}
            isUploading={editor.isUploadingCover}
            preview={editor.coverPreview}
            urlField={editor.form.register('coverUrl')}
            onFile={editor.onCoverFile}
            onRemove={editor.onCoverRemove}
          />
          <Card className={s.panel} padding='lg'>
            <FormField error={errors.slug && t('errors.slug')} hint={t('slugHint')} htmlFor={`${fieldId}-slug`} label={t('slug')}>
              <Input id={`${fieldId}-slug`} isInvalid={Boolean(errors.slug)} placeholder={t('slugPlaceholder')} {...editor.form.register('slug')} />
            </FormField>
            <FormField error={errors.seoTitle && t('errors.seoTitle')} htmlFor={`${fieldId}-seo-title`} label={t('seoTitle')}>
              <Input id={`${fieldId}-seo-title`} isInvalid={Boolean(errors.seoTitle)} {...editor.form.register('seoTitle')} />
            </FormField>
            <FormField error={errors.seoDescription && t('errors.seoDescription')} htmlFor={`${fieldId}-seo-description`} label={t('seoDescription')}>
              <Textarea
                id={`${fieldId}-seo-description`}
                isInvalid={Boolean(errors.seoDescription)}
                rows={3}
                {...editor.form.register('seoDescription')}
              />
            </FormField>
          </Card>
        </div>
      </div>
      <div className={s.footer}>
        <Button disabled={editor.isPending} type='submit' variant='secondary'>
          {editor.isPublished ? t('unpublish') : t('saveDraft')}
        </Button>
        <Button disabled={editor.isPending} type='button' onClick={editor.onPublish}>
          {editor.isPublished ? t('update') : t('publish')}
        </Button>
      </div>
    </form>
  );
};
