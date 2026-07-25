import '../../global.css';
import '@/i18n'; // Inicializamos i18n
import { Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsReady(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!isReady) {
    return null; // O puedes retornar un componente de carga (SplashScreen)
  }

  return (
    <>
      <StatusBar style="auto" />
      {session ? (
        <Stack screenOptions={{ headerShown: false }}>
          {/* Aquí irían las pantallas para usuarios autenticados */}
        </Stack>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      )}
    </>
  );
}