import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { makeRedirectUri } from 'expo-auth-session';
import { removeDeviceToken } from './NotificationService';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import {
    GoogleSignin,
    statusCodes,
    isSuccessResponse,
    isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import rawNonce from '@/lib/NonceGenerator';
// IMPORTANTE: Añade el auth de Firebase
import { GoogleAuthProvider, getAuth, AppleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';


WebBrowser.maybeCompleteAuthSession();

// 1. AÑADE ESTO: Configuración vital para Android (Usa tu ID web de Firebase)


export async function SignInWithGoogle() {
    const generatedNonce = rawNonce();
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();

        if (isSuccessResponse(response)) {
            const { accessToken } = await GoogleSignin.getTokens();
            const idToken = response.data.idToken;
            if (!idToken) {
                throw new Error('No id token present');
            }
            console.log(idToken);
            
            // --- LOGIN SUPABASE ---
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: idToken,
            });

            if (error) {
                throw Error(`Error signing in with Google (Supabase): ${error.message}`);
            }

            // --- LOGIN FIREBASE (¡Añadido!) ---
            const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
            await signInWithCredential(getAuth(getApp()), googleCredential);

        } else {
            console.log('Google Sign-In cancelled or failed');
            return;
        }

    } catch (error) {
        console.error('Error signing in with Google:', error);
    }
}

export async function SignInWithApple() {
    const generatedNonce = rawNonce();
    const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        generatedNonce
    );
    try {
        const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
            nonce: hashedNonce,
        });
        const token = credential.identityToken!;
        console.log(token);

        // --- LOGIN SUPABASE ---
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: token,
            nonce: generatedNonce
        });
        if (error) {
            throw Error(`Error signing in with Apple: ${error.message}`);
        }
        
        // --- LOGIN FIREBASE (¡Añadido!) ---
        const firebaseAppleCredential = AppleAuthProvider.credential(token, generatedNonce);
        await signInWithCredential(getAuth(getApp()),firebaseAppleCredential);
        
        console.log(data);

    } catch (error) {
        console.error('Error signing in with Apple:', error);
    }
}

export async function SignOut() {
    try {
        console.log('[AuthService] SignOut called');
        // 1. Comprobamos el proveedor a través de Supabase (Igual que en Flutter)
        const { data: { user } } = await supabase.auth.getUser();
        console.log('[AuthService] Supabase user:', user?.id);
        
        if (user) {
            // 'providers' es un array. Ej: ['google'] o ['apple']
            const providers = user.app_metadata?.providers || [];
            console.log('[AuthService] Providers:', providers);

            // 2. Si el proveedor fue Google, cerramos su sesión nativa
            if (providers.includes('google')) {
                try {
                    await GoogleSignin.signOut();
                    console.log('[AuthService] GoogleSignin signed out');
                } catch (e) {
                    console.log('Error cerrando sesión nativa de Google:', e);
                }
            }

            // (Opcional) Comprobamos de la misma manera si fue Apple
            if (providers.includes('apple')) {
                // Apple no requiere un "signOut" nativo como Google
                console.log("El usuario había iniciado sesión con Apple");
            }

            // Borramos el token del dispositivo para notificaciones
            console.log('[AuthService] Removing device token...');
            await removeDeviceToken();
            console.log('[AuthService] Device token removed');

            // 3. Cerramos la sesión en Firebase
            console.log('[AuthService] Firebase signout...');
            await getAuth(getApp()).signOut();
            console.log('[AuthService] Firebase signout done');

            // 4. Cerramos la sesión en Supabase
            console.log('[AuthService] Supabase signout...');
            const { error } = await supabase.auth.signOut({ scope: 'local' });
            console.log('[AuthService] Supabase signout done, error:', error);
            
            if (error) {
                throw error;
            }
        }
        
        console.log('[AuthService] SignOut completed successfully');
        return true;
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}