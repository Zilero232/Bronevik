'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/ui-kit';

import type { MarkdownEditorProps } from './MarkdownEditor.types';

import { MARKDOWN_EDITOR } from '../config';

const MarkdownEditorCore = dynamic(() => import('./components').then((module) => module.MarkdownEditorCore), {
  ssr: false,
  loading: () => <Skeleton height={MARKDOWN_EDITOR.skeletonHeight} shape='block' />
});

export const MarkdownEditor = (props: MarkdownEditorProps) => <MarkdownEditorCore {...props} />;
