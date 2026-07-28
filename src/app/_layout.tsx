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
          // When session is lost, we don't need to check profile.
          // The routing useEffect will handle redirecting to '/'.
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
    if (!isReady) return;
    if (session && profileStatus === 'loading') return;

    const isCompleteProfile = segments[0] === 'complete-profile';
    const isTabs = segments[0] === '(tabs)';

    if (session?.user) {
      if (profileStatus === 'incomplete' && !isCompleteProfile) {
        router.replace('/complete-profile');
      } else if (profileStatus === 'complete' && !isTabs) {
        router.replace('/(tabs)');
      }
    } else if (!session?.user) {
      // If no session and we are on any protected screen, kick back to root
      if (isTabs || isCompleteProfile) {
        router.replace('/');
      }
    }
  }, [session, isReady, segments, profileStatus]);

  // Only return null on the initial load. Once isReady is true, ALWAYS return the Stack.
  // Returning null after Stack is mounted causes Expo Router to crash.
  if (!isReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="complete-profile" />
      </Stack>
    </>
  );
}