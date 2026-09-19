import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { supabase, hasSupabaseConfig } from '../src/lib/supabase';

export default function RootLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(!hasSupabaseConfig);
    const publicRoutes = ['/', '/login', '/cadastro', '/sobre-ia', '/termos'];

    useEffect(() => {
        if (!supabase) return;

        let mounted = true;
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setReady(true);
            if (!data.session && !publicRoutes.includes(pathname)) router.replace('/login');
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session && !publicRoutes.includes(pathname)) router.replace('/login');
            if (session && (pathname === '/login' || pathname === '/cadastro')) router.replace('/portal');
        });

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, [pathname, router]);

    if (!ready) return null;

    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#F4F7FA' },
                }}
            />
        </>
    );
}
