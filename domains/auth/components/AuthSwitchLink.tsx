'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface AuthSwitchLinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

export default function AuthSwitchLink({ href, className, children }: AuthSwitchLinkProps) {
    const redirectTo = useSearchParams().get('redirectTo');
    const to = redirectTo ? `${href}?redirectTo=${encodeURIComponent(redirectTo)}` : href;

    return (
        <Link href={to} className={className}>
            {children}
        </Link>
    );
}