import { LegalPage } from '@/views/legal';
import { legalMetadata } from '@/views/legal/server';

export const generateMetadata = () => legalMetadata('privacy');

const Page = () => <LegalPage doc='privacy' />;

export default Page;
