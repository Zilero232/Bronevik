'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import type { BlogEditorPost } from '@/entities/blog/post';

import { BLOG_CATEGORIES } from '@/entities/blog/post';
import { isConflictError } from '@/shared/api/source';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import type { BlogPostFormOutput, BlogPostFormValues, BlogPostStatus, ToBlogPostInput } from '../../../lib/blog-post-form';

import { createBlogPost, updateBlogPost, uploadBlogImage } from '../../../api';
import { BLOG_POST_FORM } from '../../../config';
import { blogPostFormSchema, toBlogPostFormValues, toBlogPostInput } from '../../../lib/blog-post-form';

export const useBlogPostForm = (post: BlogEditorPost | null) => {
  const t = useTranslations('blog.editor.form');
  const tCategories = useTranslations('blog.categories');
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<BlogPostFormValues, unknown, BlogPostFormOutput>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: toBlogPostFormValues({ post, locale })
  });

  const [uploadedCover, setUploadedCover] = useState<string | null>(post?.coverKey ? post.cover : null);
  const [coverKey, coverUrl, title, excerpt] = useWatch({ control: form.control, name: ['coverKey', 'coverUrl', 'title', 'excerpt'] });

  const save = useMutation({
    mutationFn: (input: ToBlogPostInput) => {
      const body = toBlogPostInput(input);

      return post ? updateBlogPost({ id: post.id, body }) : createBlogPost(body);
    },
    onSuccess: (saved) => {
      toast.success(saved.status === 'published' ? t('published') : t('saved'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      router.push(saved.status === 'published' ? ROUTES.blog.detail(saved.slug) : ROUTES.blog.editor.edit(saved.id));
    },
    onError: (error) => toast.error(isConflictError(error) ? t('slugTaken') : t('failed'))
  });

  const uploadCover = useMutation({
    mutationFn: uploadBlogImage,
    onSuccess: ({ key, url }) => {
      setUploadedCover(url);
      form.setValue('coverKey', key, { shouldDirty: true });
      form.setValue('coverUrl', '', { shouldDirty: true });
    },
    onError: () => toast.error(t('coverFailed'))
  });

  const submitWith = (status: BlogPostStatus) => form.handleSubmit((values) => save.mutate({ values, status }));

  return {
    form,
    isEdit: post !== null,
    isPublished: post?.status === 'published',
    categoryItems: BLOG_CATEGORIES.map((value) => ({ value, label: tCategories(value) })),
    localeOptions: BLOG_POST_FORM.locales.map((value) => ({ value, label: t(`locales.${value}`) })),
    titleLimit: { length: title.length, min: BLOG_POST_FORM.titleMin, max: BLOG_POST_FORM.titleMax ?? title.length },
    excerptLimit: { length: excerpt.length, min: BLOG_POST_FORM.excerptMin, max: BLOG_POST_FORM.excerptMax ?? excerpt.length },
    coverPreview: coverKey === null ? coverUrl.trim() || null : uploadedCover,
    hasUploadedCover: coverKey !== null,
    isUploadingCover: uploadCover.isPending,
    onCoverFile: (file: File | undefined) => {
      if (file) {
        uploadCover.mutate(file);
      }
    },
    onCoverRemove: () => {
      setUploadedCover(null);
      form.setValue('coverKey', null, { shouldDirty: true });
      form.setValue('coverUrl', '', { shouldDirty: true });
    },
    onImageUpload: async (file: File) => (await uploadBlogImage(file)).url,
    isPending: save.isPending,
    onSaveDraft: submitWith('draft'),
    onPublish: submitWith('published')
  };
};
