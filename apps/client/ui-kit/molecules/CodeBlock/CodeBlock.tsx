'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { highlight } from 'sugar-high';

import type { CodeBlockProps } from './CodeBlock.types';

import { IconButton } from '../../atoms';

import s from './CodeBlock.module.scss';

export const CodeBlock = ({ code, language, title, className }: CodeBlockProps) => {
  const t = useTranslations('common');
  const { copied, copy } = useCopy();

  return (
    <figure className={clsx(s.root, className)}>
      <figcaption className={s.bar}>
        <span aria-hidden className={s.lamps}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.title}>{title ?? language}</span>
        {title && <span className={s.language}>{language}</span>}
        <IconButton aria-label={copied ? t('copied') : t('copy')} isActive={copied} size='sm' onClick={() => copy(code)}>
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
