import '../../global.css';
import '@/i18n';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StatusBar } from 'expo-status-bar';
import { requestNotificationPermission, saveDeviceToken } from '@/Service/NotificationService';
import { AppModeProvider } from '@/hooks/useAppMode';

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [profileStatus, setProfileStatus] = useState<'loading' | 'complete' | 'incomplete'>('loading');
  const segments = useSegments() as string[];
  const router = useRouter();

  // 0. CONFIGURACIÓN GOOGLE
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '56790361943-87olac8bu9i6ca617c9mms3irt19eqke.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  // 1. ESCUCHADOR DE SESIÓN
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) {
        setProfileStatus('loading');
        setIsReady(true);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('[Auth] onAuthStateChange:', _event, !!session);
        setSession(session);
        if (!session) {
          setProfileStatus('loading');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. VERIFICACIÓN DE PERFIL
  useEffect(() => {
    const checkProfile = async () => {
      try {
        if (session?.user) {
          setProfileStatus('loading');
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (data) {
            setProfileStatus('complete');
          } else {
            setProfileStatus('incomplete');
          }
        }
      } catch (err) {
        setProfileStatus('incomplete');
      } finally {
        setIsReady(true);
      }
    }

    if (session) {
      checkProfile();
    }
  }, [session]);

  // 3. NOTIFICACIONES
  useEffect(() => {
    if (profileStatus === 'complete' && session?.user) {
      const setupNotifications = async () => {
        const token = await requestNotificationPermission();
        if (token) await saveDeviceToken(session.user.id, token);
      };
      setupNotifications();
    }
  }, [profileStatus, session?.user]);

  // 4. ENRUTADOR VIGILANTE
  useEffect(() => {
    if (!isReady) return;
    if (session && profileStatus === 'loading') return;

    const inHome = segments[0] === '(home)';
    const inCompleteProfile = segments[0] === 'complete-profile';
    const inProtectedGroup = inHome || inCompleteProfile;

    if (session?.user) {
      if (profileStatus === 'incomplete' && !inCompleteProfile) {
        router.replace('/complete-profile');
      } else if (profileStatus === 'complete' && !inHome) {
        router.replace('/(home)');
      }
    } else if (!session && inProtectedGroup) {
      setTimeout(() => {
        if (router.canDismiss()) {
          try {
            router.dismissAll();
          } catch (e) { }
        }
        router.replace('/login');
      }, 0);
    }
  }, [session, isReady, segments, profileStatus]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <AppModeProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(home)" />
        <Stack.Screen name="complete-profile" />
      </Stack>
    </AppModeProvider>
  );
}