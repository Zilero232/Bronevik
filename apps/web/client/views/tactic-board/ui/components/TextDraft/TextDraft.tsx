'use client';

import { useTranslations } from 'next-intl';

import type { TextDraftProps } from './TextDraft.types';

import { BOARD_LIMITS } from '../../../config';
import { useTextDraft } from '../../../model/hooks';

import s from './TextDraft.module.scss';

export const TextDraft = ({ left, top }: TextDraftProps) => {
  const t = useTranslations('tactics.board');
  const { inputRef, text, color, onChange, onSubmit, onKeyDown, onBlur } = useTextDraft();

  return (
    <form className={s.root} style={{ left, top }} onSubmit={onSubmit}>
      <input
        ref={inputRef}
        aria-label={t('textLabel')}
        className={s.input}
        maxLength={BOARD_LIMITS.text}
        placeholder={t('textPlaceholder')}
        style={{ color }}
        value={text}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
    </form>
  );
};
