import { Stack, Redirect, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useAppMode } from '@/hooks/useAppMode';
import { supabase } from '@/lib/supabase';

export default function HomeLayout() {
    const user = useAuth();
    const segments = useSegments();
    const { mode, setMode } = useAppMode();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        if (user && isInitializing) {
            // Inicializar el contexto con el valor de la BD
            if (user.app_mode === 'Dating' || user.app_mode === 'Social') {
                setMode(user.app_mode.toLowerCase() as 'dating' | 'social');
            } else {
                setMode('social'); // Por defecto para null
            }
            setIsInitializing(false);
        }
    }, [user, isInitializing]);

    useEffect(()=>{
        let subscription: any = null;
        
        const UpdatePorfile = async()=>{
            if(!user) return;
            
            // Le añadimos un Date.now() para que el nombre del canal sea único en cada render
            const channelName = `user-update-profile-${user.username}-${Date.now()}`;
            
            subscription = supabase.channel(channelName)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'users',
                filter: `id=eq.${user.id}`,
            }, (payload) => {
                setMode(payload.new.app_mode.toLowerCase() as 'dating' | 'social');
            }).subscribe();
        } 
        UpdatePorfile();
        
        // Es OBLIGATORIO limpiar el canal cuando el componente se desmonta o el useEffect se vuelve a ejecutar
        return () => {
            if (subscription) {
                supabase.removeChannel(subscription);
            }
        };
    }, [user]);

    if (!user || isInitializing) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8E2DE2" />
            </View>
        );
    }

    const inDating = segments.includes('(DatingMode)');
    const inSocial = segments.includes('(SocialMode)');

    // 1. Si es modo Dating y está intentando entrar/estar en Social, lo forzamos a Dating
    if (mode === 'dating' && inSocial) {
        return <Redirect href="/(home)/(DatingMode)/(tabs)" />;
    }

    // 2. Si NO es modo Dating y está intentando entrar en Dating, lo forzamos a Social
    if (mode !== 'dating' && inDating) {
        return <Redirect href="/(home)/(SocialMode)/(tabs)" />;
    }

    // 3. Si llega a la raíz /(home) sin especificar modo, lo mandamos al que le toca
    if (segments.length === 1 && segments[0] === '(home)') {
        if (mode === 'dating') {
            return <Redirect href="/(home)/(DatingMode)/(tabs)" />;
        } else {
            return <Redirect href="/(home)/(SocialMode)/(tabs)" />;
        }
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(SocialMode)" />
            <Stack.Screen name="(DatingMode)" />
        </Stack>
    );
}