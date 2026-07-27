import { View, Text, Platform, useColorScheme, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { GlassView } from "expo-glass-effect";
import { useTranslation } from 'react-i18next';
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import MaskedView from "@react-native-masked-view/masked-view";
import { SignInWithGoogle } from "@/Service/AuthService";
function LoginFormIOS({ isDark, googleSubmit }: { isDark: boolean; googleSubmit: (e: any) => void }) {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(true);
    const { t } = useTranslation();
    const login = t('loginWithGoogle');




    return (
        <View
            className={`flex flex-col gap-3 w-full ${isDark ? 'bg-dark' : 'bg-light'}`}>
            <TouchableOpacity onPress={(e) => { googleSubmit(e) }} className={`rounded-full mb-3`}>
                <GlassView
                    glassEffectStyle='regular'
                    isInteractive={true}
                    style={{
                        borderRadius: 9999
                    }}
                >
                    <View className="flex flex-row items-center justify-center p-5 gap-3">
                        <Svg width="24" height="24" viewBox="0 0 24 24">
                            <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </Svg>
                        <Text className={`text-center text-lg ${isDark ? 'text-white' : 'text-black'}`}>{t('loginWithGoogle')}</Text>
                    </View>
                </GlassView>
            </TouchableOpacity>
            <TouchableOpacity onPress={(e) => { googleSubmit(e) }} className={`rounded-full mb-3`}>
                <GlassView
                    glassEffectStyle='regular'
                    isInteractive={true}
                    style={{
                        borderRadius: 9999
                    }}
                >
                    <View className="flex flex-row items-center justify-center p-5 gap-3">
                        <Ionicons name="logo-apple" size={24} color={isDark ? 'white' : 'black'} />
                        <Text className={`text-center text-lg ${isDark ? 'text-white' : 'text-black'}`}>{t('loginWithGoogle')}</Text>
                    </View>
                </GlassView>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }} className={`rounded-full mb-3`}>

                <LinearGradient
                    colors={['#4c669f', '#3b5998', '#192f6a']}
                    style={[styles.button, { borderRadius: 9999 }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}

                >


                    <Text className={`text-white text-lg  text-center`}>{t('login')}</Text>
                </LinearGradient>

            </TouchableOpacity>
        </View >
    );
}



export default function LoginForm() {
    const { t } = useTranslation();
    const isDark = useColorScheme() === 'dark';
    const googleSubmit = async (e: any) => {
        e.preventDefault();
        try {

            await SignInWithGoogle();
        } catch (error) {
            console.error('Error occurred while submitting Google login:', error);
        }
    }



    if (Platform.OS === 'ios') return <LoginFormIOS isDark={isDark} googleSubmit={googleSubmit} />;
    return (
        <View className={`w-full p-4 rounded-xl ${isDark ? 'bg-dark' : 'bg-light'}`}>
            <TouchableOpacity onPress={(e) => { googleSubmit(e) }} style={stylesLoginForm({ isDark }).button}>
                <View className="flex flex-row items-center justify-center p-5 gap-3">
                    <Svg width="24" height="24" viewBox="0 0 24 24">
                        <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </Svg>
                    <Text className={`text-center text-lg`} style={stylesLoginForm({ isDark }).buttonText}>{t('loginWithGoogle')}</Text>
                </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}  >
                <LinearGradient
                    colors={['#8E2DE2', '#4a00e0', '#8E2DE2']}
                    style={[styles.button, { borderRadius: 9999 }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}

                >
                    <Text className={`text-white text-center`}>{t('login')}</Text>
                </LinearGradient>
            </TouchableOpacity>


        </View>
    );
}

export function stylesLoginForm({ isDark }: { isDark: boolean }) {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },

        button: {
            padding: 0,
            backgroundColor: isDark ? 'white' : 'white',
            borderRadius: 9999,
            marginBottom: 10,
            borderWidth: isDark ? 1 : 1,
            borderColor: isDark ? 'white' : 'lightgray',
        },
        buttonText: {
            color: 'black',
            fontWeight: 'bold',
        },
    });
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        paddingVertical: 15,

        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});