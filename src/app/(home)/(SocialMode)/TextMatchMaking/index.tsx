import useAuth from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { t } from "i18next";
import { useEffect } from "react";
import { Modal, Platform, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function TextGame() {
    const user = useAuth();
    useEffect(() => {
        const createMatchMaking = async () => {
            
        }

        createMatchMaking();
    }, [user]);
    const isDark = useColorScheme() === 'dark';


    const cancelMatcMaking = async() => {
        try {
            const supabaseQuery = await supabase.from('social_text_matchmaking').delete().eq('user_id', user?.id).select();

            router.back();
        } catch (error) {
            console.error('Error cancelando matchmaking:', error);
        }
    }


    return (
        <SafeAreaView edges={['top']} className={`flex-1 ${isDark ? 'bg-black' : 'bg-white'}`}>
            <View className={`flex flex-col  ${isDark ? 'bg-black' : 'bg-white'}`}>
                <TouchableOpacity
                onPress={() => cancelMatcMaking()}
                >
                    {Platform.OS === 'ios' ? (
                        <GlassView
                        isInteractive={true}
                        glassEffectStyle='regular'
                        style={{
                            borderRadius: 99999,
                            width: 48,
                            height: 48,
      
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 15
                        }}
                        >
                            <Ionicons name='close' size={24} color={isDark ? 'white' : 'black'} />
                        </GlassView>
                    ):(
                        <View>
                            <Ionicons name="close" size={24} color={isDark ? 'white' : 'black'} />
                        </View>
                    )}


                    <Text className={`text-center text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{t('game')}</Text>
                </TouchableOpacity>
                

            </View>
            <View className={`${isDark ? 'bg-black' : 'bg-white'} w-full h-full justify-center items-center`}>
                <Text className={`text-center ${isDark ? 'text-white' : 'text-black'}`}>Buscando a alguien que quiera chatear contigo...</Text>
            </View>
        </SafeAreaView>
    );
}