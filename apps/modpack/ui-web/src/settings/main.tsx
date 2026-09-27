import { render } from 'preact';

import { App } from './ui/app/App';

const root = document.getElementById('root');

if (root) {
  render(<App />, root);
}
