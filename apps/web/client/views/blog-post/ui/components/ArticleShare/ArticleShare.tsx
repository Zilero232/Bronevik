'use client';

import { Link2, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, buttonVariants } from '@/ui-kit';

import { useArticleShare } from '../../../model/hooks';

import s from './ArticleShare.module.scss';

export const ArticleShare = () => {
  const t = useTranslations('blog.article');
  const { links, copyLink } = useArticleShare();

  return (
    <section aria-label={t('share')} className={s.root}>
      <p className={s.title}>{t('share')}</p>
      <div className={s.buttons}>
        {links.map(({ target, href }) => (
          <a key={target} className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={href} rel='noopener noreferrer' target='_blank'>
            <Send aria-hidden size={14} />
            {t(`shareTargets.${target}`)}
          </a>
        ))}
        <Button size='sm' variant='ghost' onClick={copyLink}>
          <Link2 aria-hidden size={14} />
          {t('copyLink')}
        </Button>
      </div>
    </section>
  );
};
