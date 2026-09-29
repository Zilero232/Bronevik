'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { ROUTES } from '@/shared/constants';
import { localePath, resolveLocale } from '@/shared/i18n';
import { absoluteUrl } from '@/shared/seo';

import { shareLinks } from '../../../lib/share-links';
import { useArticle } from '../../context';

export const useArticleShare = () => {
  const t = useTranslations('blog.article');
  const locale = useLocale();
  const { post } = useArticle();
  const { copy } = useCopy();

  const url = absoluteUrl(localePath({ path: ROUTES.blog.detail(post.slug), locale: resolveLocale(locale) }));

  return {
    links: shareLinks({ url, title: post.title }),
    copyLink: async () => {
      try {
        await copy(url);
        toast.success(t('copied'));
      } catch {
        toast.error(t('copyFailed'));
      }
    }
  };
};
