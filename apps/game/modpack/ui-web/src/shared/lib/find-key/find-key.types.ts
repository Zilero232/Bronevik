export type KeyRoot = Pick<Document, 'addEventListener' | 'removeEventListener'>;

export type FindKey = Pick<KeyboardEvent, 'ctrlKey' | 'key' | 'keyCode'>;

export type BindFindKeyInput = {
  root: KeyRoot;
  onFind: () => void;
};
