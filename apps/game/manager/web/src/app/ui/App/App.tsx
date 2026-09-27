import { AppProviders } from '../AppProviders';
import { PageOutlet } from '../PageOutlet';

export const App = () => (
  <AppProviders>
    <PageOutlet />
  </AppProviders>
);
