import { render } from 'preact';

import { App } from './ui/app';

import './styles/global.scss';

const start = (): void => {
  const root = document.getElementById('root');

  if (root) {
    render(<App />, root);
  }
};

if (import.meta.env.DEV) {
  void import('../dev/mock-bridge').then(({ installMockBridge }) => {
    installMockBridge();
    start();
  });
} else {
  start();
}
