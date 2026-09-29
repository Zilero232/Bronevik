'use client';

import { MDXEditor } from '@mdxeditor/editor';
import { clsx } from 'clsx';

import type { MarkdownEditorCoreProps } from './MarkdownEditorCore.types';

import { useMarkdownEditorPlugins } from '../../../model/hooks';
import { EditorToolbar } from '../EditorToolbar';

import s from './MarkdownEditorCore.module.scss';

import '@mdxeditor/editor/style.css';

export const MarkdownEditorCore = ({ markdown, placeholder, isInvalid = false, onChange, onImageUpload }: MarkdownEditorCoreProps) => {
  const { plugins, themeClassName } = useMarkdownEditorPlugins({ toolbar: EditorToolbar, onImageUpload });

  return (
    <div className={s.root} data-invalid={isInvalid}>
      <MDXEditor
        className={clsx(s.editor, themeClassName)}
        contentEditableClassName={s.content}
        markdown={markdown}
        placeholder={placeholder}
        plugins={plugins}
        onChange={onChange}
      />
    </div>
  );
};
