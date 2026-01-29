'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store/useUserStore';

export function AuthInit() {
    const checkAuth = useUserStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return null;
}
