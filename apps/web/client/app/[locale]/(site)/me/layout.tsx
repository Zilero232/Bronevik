import { AccountShell } from '@/widgets/account/account-shell';

const AccountLayout = ({ children }: LayoutProps<'/[locale]/me'>) => <AccountShell>{children}</AccountShell>;

export default AccountLayout;
