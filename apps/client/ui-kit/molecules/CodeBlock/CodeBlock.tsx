'use client';

import { clsx } from 'clsx';
import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { highlight } from 'sugar-high';

import { useCopyFeedback } from '@/shared/lib';

import type { CodeBlockProps } from './CodeBlock.types';

import { IconButton } from '../../atoms';

import s from './CodeBlock.module.scss';

export const CodeBlock = ({ code, language, title, className }: CodeBlockProps) => {
  const t = useTranslations('common');
  const { copied, onCopyClick } = useCopyFeedback({ value: code });

  return (
    <figure className={clsx(s.root, className)}>
      <figcaption className={s.bar}>
        <span className={s.title}>{title ?? language}</span>
        {title && <span className={s.language}>{language}</span>}
        <IconButton aria-label={copied ? t('copied') : t('copy')} isActive={copied} size='sm' onClick={onCopyClick}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </IconButton>
      </figcaption>
      <pre className={s.pre}>
        {/* eslint-disable-next-line react/dom-no-dangerously-set-innerhtml -- sugar-high returns escaped markup for our own static samples */}
        <code className={s.code} dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </figure>
  );
};
