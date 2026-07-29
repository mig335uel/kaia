import '../../global.css';
import '@/i18n'; // Inicializamos i18n
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StatusBar } from 'expo-status-bar';
import { requestNotificationPermission, saveDeviceToken } from '@/Service/NotificationService';
import rawNonce from '@/lib/NonceGenerator';

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [profileStatus, setProfileStatus] = useState<'loading' | 'complete' | 'incomplete'>('loading');
  const segments = useSegments();
  const router = useRouter();
  const generatedNonce = rawNonce();


  useEffect(() => {
    // Configuración con auto-detección
    GoogleSignin.configure({
      // ¡Importante! Lleva guion: 'auto-detect'
      webClientId: '56790361943-87olac8bu9i6ca617c9mms3irt19eqke.apps.googleusercontent.com',
      offlineAccess: true,

    });
  }, []);

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
      try {
        if (session?.user) {
          console.log('[Auth] Checking profile for user:', session.user.id);
          setProfileStatus('loading');
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.log('[Auth] Profile check error:', error);
          }

          if (data) {
            console.log('[Auth] Profile complete');
            setProfileStatus('complete');
          } else {
            console.log('[Auth] Profile incomplete');
            setProfileStatus('incomplete');
          }
        }
      } catch (err) {
        console.error('[Auth] Exception in checkProfile:', err);
      } finally {
        console.log('[Auth] Setting isReady to true');
        setIsReady(true);
      }
    }

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

    const inTabs = segments[0] === '(tabs)';
    const inCompleteProfile = segments[0] === 'complete-profile';
    const inProtectedGroup = inTabs || inCompleteProfile;

    if (session?.user) {
      if (profileStatus === 'incomplete' && !inCompleteProfile) {
        console.log('Routing to /complete-profile');
        router.replace('/complete-profile');
      } else if (profileStatus === 'complete' && !inTabs) {
        console.log('Routing to /(tabs)');
        router.replace('/(tabs)');
      }
    } else if (!session?.user && inProtectedGroup) {
      console.log('Routing to / (root)');
      router.replace('/');
    }
  }, [session, isReady, segments, profileStatus]);

  // Use a transparent effect for Expo Router instead of returning null
  useEffect(() => {
    if (isReady) {
      // Ocultar cualquier splash screen manual si lo tuvieras
    }
  }, [isReady]);

  if (!isReady) {
    // Es mejor renderizar el layout base vacío o con un color de fondo 
    // para no romper el árbol de navegación de Expo Router
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
    );
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