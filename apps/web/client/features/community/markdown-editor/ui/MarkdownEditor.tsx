'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/ui-kit';

import type { MarkdownEditorProps } from './MarkdownEditor.types';

import { MARKDOWN_EDITOR } from '../config';

export const MarkdownEditor = dynamic<MarkdownEditorProps>(() => import('./components').then((module) => module.MarkdownEditorCore), {
  ssr: false,
  loading: () => <Skeleton height={MARKDOWN_EDITOR.skeletonHeight} shape='block' />
});
