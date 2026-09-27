'use client';

import type { FormEvent, KeyboardEvent } from 'react';

import { useEffect, useRef, useState } from 'react';

import { useWorkspace } from '../../context';

export const useTextDraft = () => {
  const { color, onTextSubmit, onTextCancel } = useWorkspace();
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onTextSubmit(text);
    setText('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setText('');
      onTextCancel();
    }
  };

  const onBlur = () => {
    onTextSubmit(text);
    setText('');
  };

  return { inputRef, text, color, onChange: setText, onSubmit, onKeyDown, onBlur };
};
