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
WebBrowser.maybeCompleteAuthSession();

export async function SignInWithGoogle() {
    const generatedNonce = rawNonce();
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();

        if (isSuccessResponse(response)) {
            const idToken = response.data.idToken;
            if (!idToken) {
                throw new Error('No id token present');
            }
            console.log(idToken);
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: idToken,
            });

            if (error) {
                throw Error(`Error signing in with Google: ${error.message}`);
            }
        } else {
            console.log('Google Sign-In cancelled or failed');
            return;
        }

        // if (data?.url) {
        //     const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

        //     if (res.type === 'success' && res.url) {
        //         const { params, errorCode } = QueryParams.getQueryParams(res.url);

        //         if (errorCode) {
        //             throw new Error(errorCode);
        //         }

        //         if (params?.code) {
        //             await supabase.auth.exchangeCodeForSession(params.code);
        //         } else if (params?.access_token && params?.refresh_token) {
        //             await supabase.auth.setSession({
        //                 access_token: params.access_token,
        //                 refresh_token: params.refresh_token,
        //             });
        //         }
        //     }

        //     return data;
        // }

    } catch (error) {
        console.error('Error signing in with Google:', error);
    }
}

export async function SignInWithApple() {
    const generatedNonce = rawNonce();
    // 2. Hash the raw nonce using SHA256 (Note: this is an async operation in React Native)
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

        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: token,
            nonce: generatedNonce
        });
        if (error) {
            throw Error(`Error signing in with Apple: ${error.message}`);
        }
        console.log(data);


    } catch (error) {
        console.error('Error signing in with Apple:', error);
    }
}



export async function SignOut() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            await removeDeviceToken();
            const { error } = await supabase.auth.signOut({ scope: 'local' });
            
            try {
                await GoogleSignin.signOut();
            } catch (e) {
                console.log('Google SignOut error or not signed in with Google');
            }
            
            if (error) {
                throw error;
            }
        }
        return true;
    } catch (error) {
        console.error('Error signing out:', error);
    }
}