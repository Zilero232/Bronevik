import { LegalPage } from '@/views/legal';
import { legalMetadata } from '@/views/legal/server';

export const generateMetadata = () => legalMetadata('contacts');

const Page = () => <LegalPage doc='contacts' />;

export default Page;
