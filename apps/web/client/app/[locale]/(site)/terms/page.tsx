import { LegalPage } from '@/views/legal';
import { legalMetadata } from '@/views/legal/server';

export const generateMetadata = () => legalMetadata('terms');

const Page = () => <LegalPage doc='terms' />;

export default Page;
