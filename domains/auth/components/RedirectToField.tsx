'use client';

import { useSearchParams } from 'next/navigation';

export default function RedirectToField() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') ?? '/';

    return <input type="hidden" name="redirectTo" value={redirectTo} />;
}