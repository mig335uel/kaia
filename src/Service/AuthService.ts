import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { makeRedirectUri } from 'expo-auth-session';
import { removeDeviceToken } from './NotificationService';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
WebBrowser.maybeCompleteAuthSession();

export async function SignInWithGoogle() {
    try {
        const redirectUrl = makeRedirectUri({
            scheme: 'kaia',
            path: 'login-callback',
        });

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                skipBrowserRedirect: true,
            },
        });

        if (error) {
            throw Error(`Error signing in with Google: ${error.message}`);
        }

        if (data?.url) {
            const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

            if (res.type === 'success' && res.url) {
                const { params, errorCode } = QueryParams.getQueryParams(res.url);

                if (errorCode) {
                    throw new Error(errorCode);
                }

                if (params?.code) {
                    await supabase.auth.exchangeCodeForSession(params.code);
                } else if (params?.access_token && params?.refresh_token) {
                    await supabase.auth.setSession({
                        access_token: params.access_token,
                        refresh_token: params.refresh_token,
                    });
                }
            }

            return data;
        }

    } catch (error) {
        console.error('Error signing in with Google:', error);
    }
}

export async function SignInWithApple() {
    const rawNonce = Crypto.randomUUID();
    // 2. Hash the raw nonce using SHA256 (Note: this is an async operation in React Native)
    const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
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

        const {data, error} = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: token,
            nonce: rawNonce
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
        await removeDeviceToken();
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error signing out:', error);
    }
}