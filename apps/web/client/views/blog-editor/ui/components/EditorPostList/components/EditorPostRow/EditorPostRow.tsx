'use client';

import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { BlogCategoryChip } from '@/entities/blog/post';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, Button, buttonVariants, ConfirmDialog } from '@/ui-kit';

import type { EditorPostRowProps } from './EditorPostRow.types';

import { BLOG_EDITOR } from '../../../../../config';

import s from './EditorPostRow.module.scss';

export const EditorPostRow = ({ post, isRemoving, onRemove }: EditorPostRowProps) => {
  const t = useTranslations('blog.editor.list');
  const format = useFormatter();

  return (
    <article className={s.root}>
      <div className={s.main}>
        <div className={s.badges}>
          <Badge tone={BLOG_EDITOR.statusTone[post.status]}>{t(`statuses.${post.status}`)}</Badge>
          <BlogCategoryChip category={post.category} />
          {post.isFeatured && <Badge tone='gold'>{t('featured')}</Badge>}
        </div>
        <h2 className={s.title}>{post.title}</h2>
        <p className={s.meta}>{t('updated', { date: format.dateTime(new Date(post.updatedAt), 'dateTime') })}</p>
      </div>
      <div className={s.actions}>
        {post.status === 'published' && (
          <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.blog.detail(post.slug)}>
            <ExternalLink aria-hidden size={14} />
            {t('view')}
          </Link>
        )}
        <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.blog.editor.edit(post.id)}>
          <Pencil aria-hidden size={14} />
          {t('edit')}
        </Link>
        <ConfirmDialog
          trigger={
            <Button size='sm' variant='ghost'>
              <Trash2 aria-hidden size={14} />
              {t('delete')}
            </Button>
          }
          cancelLabel={t('cancel')}
          confirmLabel={t('delete')}
          description={t('deleteDescription')}
          isPending={isRemoving}
          title={t('deleteTitle')}
          tone='danger'
          onConfirm={() => onRemove(post.id)}
        />
      </div>
    </article>
  );
};
