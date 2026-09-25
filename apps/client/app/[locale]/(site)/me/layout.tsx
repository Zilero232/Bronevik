import type { ReactNode } from 'react';

import { AccountShell } from '@/widgets/account/account-shell';

const AccountLayout = ({ children }: { children: ReactNode }) => <AccountShell>{children}</AccountShell>;

export default AccountLayout;
