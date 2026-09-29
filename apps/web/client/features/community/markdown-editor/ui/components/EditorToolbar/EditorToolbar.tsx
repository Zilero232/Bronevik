'use client';

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  UndoRedo
} from '@mdxeditor/editor';

export const EditorToolbar = () => (
  <>
    <UndoRedo />
    <Separator />
    <BlockTypeSelect />
    <BoldItalicUnderlineToggles />
    <Separator />
    <ListsToggle />
    <CreateLink />
    <InsertImage />
    <InsertTable />
    <InsertThematicBreak />
  </>
);
