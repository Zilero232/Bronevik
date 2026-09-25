'use client';

import { useBoolean, useCopy } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { CopyFieldProps } from './CopyField.types';

import { IconButton } from '../../atoms';

import s from './CopyField.module.scss';

const MASK = '•';

export const CopyField = ({ value, label, isSecret = false, tone = 'neutral', className, onCopy }: CopyFieldProps) => {
  const t = useTranslations('common');
  const { copied, copy } = useCopy();
  const [isRevealed, toggleRevealed] = useBoolean(!isSecret);

  const shown = isRevealed ? value : MASK.repeat(Math.min(value.length, 32));

  const onCopyClick = async () => {
    await copy(value);
    onCopy?.();
  };

  return (
    <div className={clsx(s.root, className)} data-tone={tone}>
      {label && <span className={s.label}>{label}</span>}
      <div className={s.field}>
        <code className={s.value} data-masked={!isRevealed}>
          {shown}
        </code>
        {isSecret && (
          <IconButton aria-label={isRevealed ? t('hide') : t('show')} size='sm' onClick={() => toggleRevealed()}>
            {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
          </IconButton>
        )}
        <IconButton aria-label={copied ? t('copied') : t('copy')} isActive={copied} size='sm' onClick={onCopyClick}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </IconButton>
      </div>
    </div>
  );
};
