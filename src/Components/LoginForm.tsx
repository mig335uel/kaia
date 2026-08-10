import { View, Text, Platform, useColorScheme, KeyboardAvoidingView, TouchableOpacity, StyleSheet, TextInput, Alert, LayoutAnimation, Image, TouchableWithoutFeedback, Keyboard } from "react-native";
import { GlassView } from "expo-glass-effect";
import { useTranslation } from 'react-i18next';
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import MaskedView from "@react-native-masked-view/masked-view";
import { SignInWithAgoras, SignInWithApple, SignInWithGoogle } from "@/Service/AuthService";

function EmailLoginForm({ onBack, isDark }: { onBack: () => void, isDark: boolean }) {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex flex-col gap-4 w-full">
                <TouchableOpacity onPress={onBack} className="self-start p-2 mb-2">
                    <Ionicons name="chevron-back" size={24} color={isDark ? 'white' : 'black'} />
                </TouchableOpacity>

                <View className={`w-full p-4 rounded-xl flex-row items-center gap-3 ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
                    <Ionicons name="mail-outline" size={20} color={isDark ? '#888' : '#666'} />
                    <TextInput
                        placeholder={t('email')}
                        placeholderTextColor={isDark ? '#888' : '#666'}
                        className={`flex-1 text-base ${isDark ? 'text-white' : 'text-black'}`}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                </View>

                <View className={`w-full p-4 rounded-xl flex-row items-center gap-3 ${isDark ? 'bg-[#1E1E1E]' : 'bg-white'}`}>
                    <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#888' : '#666'} />
                    <TextInput
                        placeholder={t('password')}
                        placeholderTextColor={isDark ? '#888' : '#666'}
                        className={`flex-1 text-base ${isDark ? 'text-white' : 'text-black'}`}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity className="mt-6 rounded-full" onPress={() => { }}>
                    <LinearGradient
                        colors={['#6A5BFC', '#7575FF', '#3FCECC']}
                        style={[styles.button, { borderRadius: 9999 }]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                    >
                        <Text className={`text-white text-lg text-center font-extrabold`}>{t('enter', 'Entrar')}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

function LoginFormIOS({ isDark, googleSubmit, appleSubmit, showEmailForm, setShowEmailForm, agorasSubmit }: any) {
    const { t } = useTranslation();

    if (showEmailForm) {
        return <EmailLoginForm onBack={() => setShowEmailForm(false)} isDark={isDark} />;
    }

    return (
        <View className={`flex flex-col gap-3 w-full ${isDark ? 'bg-dark' : 'bg-light'}`}>
            <TouchableOpacity onPress={(e) => { appleSubmit(e) }} className={`rounded-full mb-3`}>
                <GlassView glassEffectStyle='regular' isInteractive={true} style={{ borderRadius: 9999 }}>
                    <View className="flex flex-row items-center justify-center p-5 gap-3">
                        <Ionicons name="logo-apple" size={24} color={isDark ? 'white' : 'black'} />
                        <Text className={`text-center text-lg ${isDark ? 'text-white' : 'text-black'}`}>{t('loginWithApple')}</Text>
                    </View>
                </GlassView>
            </TouchableOpacity>

            <TouchableOpacity onPress={(e) => { googleSubmit(e) }} className={`rounded-full mb-3`}>
                <GlassView glassEffectStyle='regular' isInteractive={true} style={{ borderRadius: 9999 }}>
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
            <TouchableOpacity onPress={(e) => { agorasSubmit(e) }} className={`rounded-full mb-3`}>
                <GlassView glassEffectStyle='regular' isInteractive={true} style={{ borderRadius: 9999 }}>
                    <View className="flex flex-row items-center justify-center p-5 gap-3">
                        <Image
                            source={require('@assets/AgorasLogo.png')}
                            style={{ width: 24, height: 24 }}
                        />
                        <Text className={`text-center text-lg ${isDark ? 'text-white' : 'text-black'}`}>{t('loginWithAgoras')}</Text>
                    </View>
                </GlassView>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setShowEmailForm(true);
            }} className={`rounded-full mb-3`}>
                <LinearGradient
                    colors={['#6A5BFC', '#7575FF', '#3FCECC']}
                    style={[styles.button, { borderRadius: 9999 }]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <Text className={`text-white text-lg text-center font-extrabold`}>{t('login')}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View >
    );
}

export default function LoginForm() {
    const { t } = useTranslation();
    const isDark = useColorScheme() === 'dark';
    const [showEmailForm, setShowEmailForm] = useState(false);

    const googleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await SignInWithGoogle();
        } catch (error) {
            console.error('Error occurred while submitting Google login:', error);
        }
    }

    const appleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await SignInWithApple();
        } catch (error) {
            console.error('Error occurred while submitting Apple login:', error);
        }
    }

    const agorasSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await SignInWithAgoras();
        } catch (error) {
            console.error('Error occurred while submitting Agoras login:', error);
        }
    }

    if (Platform.OS === 'ios') {
        return <LoginFormIOS
            isDark={isDark}
            googleSubmit={googleSubmit}
            appleSubmit={appleSubmit}
            agorasSubmit={agorasSubmit}
            showEmailForm={showEmailForm}
            setShowEmailForm={setShowEmailForm}
        />;
    }

    return (
        <View className={`w-full p-4 rounded-xl ${isDark ? 'bg-dark' : 'bg-light'}`}>
            {showEmailForm ? (
                <EmailLoginForm onBack={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setShowEmailForm(false);
                }} isDark={isDark} />
            ) : (
                <>
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
                    <TouchableOpacity onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setShowEmailForm(true);
                    }}>
                        <LinearGradient
                            colors={['#6A5BFC', '#7575FF', '#3FCECC']}
                            style={[styles.button, { borderRadius: 9999 }]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                        >
                            <Text className={`text-white text-center font-bold`}>{t('login')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </>
            )}
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