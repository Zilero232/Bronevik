'use client';

import { useCopy } from '@siberiacancode/reactuse';
import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { IconButton } from '@/ui-kit';

import type { ChallengeCodeProps } from './ChallengeCode.types';

import s from './ChallengeCode.module.scss';

export const ChallengeCode = ({ code }: ChallengeCodeProps) => {
  const t = useTranslations('streamer.challenges.list');
  const tCommon = useTranslations('common');
  const { copied, copy } = useCopy();

  return (
    <div className={s.root}>
      <span className={s.label}>{t('code')}</span>
      <div className={s.row}>
        <code className={s.code}>{code}</code>
        <IconButton
          aria-label={copied ? tCommon('copied') : tCommon('copy')}
          isActive={copied}
          size='sm'
          variant='outline'
          onClick={() => copy(code)}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </IconButton>
      </div>
      <span className={s.hint}>{t('codeHint')}</span>
    </div>
  );
};
