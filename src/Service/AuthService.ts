import {supabase} from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { makeRedirectUri } from 'expo-auth-session';

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