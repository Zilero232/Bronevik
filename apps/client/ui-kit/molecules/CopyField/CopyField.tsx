'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useCopyFeedback } from '@/shared/lib';

import type { CopyFieldProps } from './CopyField.types';

import { IconButton } from '../../atoms';
import { COPY_FIELD } from './CopyField.constants';

import s from './CopyField.module.scss';

export const CopyField = ({ value, label, isSecret = false, tone = 'neutral', className, onCopy }: CopyFieldProps) => {
  const t = useTranslations('common');
  const { copied, onCopyClick } = useCopyFeedback({ value, onCopy });
  const [isRevealed, toggleRevealed] = useBoolean(!isSecret);

  const shown = isRevealed ? value : COPY_FIELD.mask.repeat(Math.min(value.length, COPY_FIELD.maskLength));

  return (
    <div className={clsx(s.root, className)} data-tone={tone}>
      {label && <span className={s.label}>{label}</span>}
      <div className={s.field}>
        <code className={s.value} data-masked={!isRevealed}>
          {shown}
        </code>
        {isSecret && (
          <IconButton aria-label={isRevealed ? t('hide') : t('show')} size='sm' onClick={() => toggleRevealed()}>
            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
          </IconButton>
        )}
        <IconButton aria-label={copied ? t('copied') : t('copy')} isActive={copied} size='sm' onClick={onCopyClick}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </IconButton>
      </div>
    </div>
  );
};
