import '../../global.css';
import '@/i18n'; // Inicializamos i18n
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { requestNotificationPermission, saveDeviceToken } from '@/Service/NotificationService';

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [profileStatus, setProfileStatus] = useState<'loading' | 'complete' | 'incomplete'>('loading');
  const segments = useSegments();
  const router = useRouter();

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

  useEffect(() => {
    const checkProfile = async () => {
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
      setIsReady(true);
    };

    if (session) {
      checkProfile();
    }
  }, [session]);

  useEffect(() => {
    if (profileStatus === 'complete' && session?.user) {
      const setupNotifications = async () => {
        const token = await requestNotificationPermission();
        if (token) {
          await saveDeviceToken(session.user.id, token);
        }
      };
      setupNotifications();
    }
  }, [profileStatus, session?.user]);

  useEffect(() => {
    if (!isReady || (session && profileStatus === 'loading')) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const inCompleteProfile = segments[0] === 'complete-profile';

    if (session?.user) {
      if (profileStatus === 'incomplete' && !inCompleteProfile) {
        router.replace('/complete-profile');
      } else if (profileStatus === 'complete' && !inTabsGroup) {
        router.replace('/(tabs)');
      }
    } else if (!session?.user && (inTabsGroup || inCompleteProfile)) {
      router.replace('/');
    }
  }, [session, isReady, segments, profileStatus]);

  if (!isReady || (session && profileStatus === 'loading')) {
    return null; // O puedes retornar un componente de carga (SplashScreen)
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}