export type MediaSource = {
  src: string | null;
  isLoaded: boolean;
  onLoad: () => void;
  onError: () => void;
};
