'use client';

import { useTranslations } from 'next-intl';

import { Button, Textarea } from '@/ui-kit';

import type { CommentComposerProps } from './CommentComposer.types';

import { useCommentForm } from '../../../model/hooks';

import s from './CommentComposer.module.scss';

export const CommentComposer = ({ thread, parentId, onDone, onCancel }: CommentComposerProps) => {
  const t = useTranslations('community.comments');
  const { form, length, maxLength, isPending, onSubmit } = useCommentForm({ thread, parentId, onDone });
  const { errors } = form.formState;

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <Textarea
        aria-label={parentId ? t('replyPlaceholder') : t('placeholder')}
        isInvalid={Boolean(errors.body)}
        maxLength={maxLength}
        placeholder={parentId ? t('replyPlaceholder') : t('placeholder')}
        rows={parentId ? 2 : 3}
        {...form.register('body')}
      />
      <div className={s.footer}>
        <span className={s.counter} data-invalid={Boolean(errors.body)}>
          {errors.body ? t('errors.body') : t('counter', { length, max: maxLength ?? length })}
        </span>
        <div className={s.actions}>
          {onCancel && (
            <Button size='sm' type='button' variant='ghost' onClick={onCancel}>
              {t('cancel')}
            </Button>
          )}
          <Button disabled={isPending} size='sm' type='submit'>
            {parentId ? t('reply') : t('send')}
          </Button>
        </div>
      </div>
    </form>
  );
};
