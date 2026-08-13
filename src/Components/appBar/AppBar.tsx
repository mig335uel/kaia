import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import { Ionicons, Octicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { GlassView } from "expo-glass-effect";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";



export function AppBar({ isDark, feedPreferencesModalView }: { isDark: boolean, feedPreferencesModalView: () => void }) {
    const { t } = useTranslation();
    const user = useAuth();
    const [notificationscount, setNotificationsCount] = useState<number>(0);

    useEffect(()=>{
        const recolectNotification = async()=>{
            if (!user) return;
            const { count, error } = await supabase
                .from('social_notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('read', false);
            if(error){
                console.error('Error recolectando notificaciones', error)
            } else {
                setNotificationsCount(count || 0);
            }
        }
        recolectNotification();
    },[user]);
    return (
        <>
            <View className={`flex-row items-center justify-between px-6 ${isDark ? 'bg-[#1f2937]' : 'bg-white'} relative`}>
                <TouchableOpacity onPress={() => router.push('/Notifications')} style={{ position: 'relative' }}>
                    <GlassView
                        isInteractive={true}
                        glassEffectStyle='regular'
                        tintColor={isDark ? '#1f2937' : 'white'}
                        style={{
                            borderRadius: 24,
                            width: 48,
                            height: 48,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}
                    >
                        {isDark ? (
                            <Ionicons name="notifications" size={20} color="white" />
                        ) : (
                            <Ionicons name="notifications" size={20} color="black" />
                        )}
                    </GlassView>
                    
                    {/* Badge de Notificación con LinearGradient */}
                    {notificationscount > 0 ?(
                        <View style={{ position: 'absolute', top: 0, right: 0 }}>
                        <LinearGradient
                            colors={['#6A5BFC', '#7575FF', '#3FCECC']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: 9,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: isDark ? '#1f2937' : 'white',
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{notificationscount.toString()}</Text>
                        </LinearGradient>
                    </View>):(<></>)}
                    
                </TouchableOpacity>
                <View className="flex-row items-center">
                    <Image
                        source={require('../../../assets/Kaia.png')}
                        style={{ width: 40, height: 40 }}
                        resizeMode="contain"
                    />
                    <MaskedView

                        maskElement={<Text className={`flex-row ${isDark ? 'text-white' : 'text-black'} text-[25px] font-bold justify-center items-center `}>{t("appName")}</Text>}>
                        <LinearGradient
                            colors={['#6A5BFC', '#7575FF', '#3FCECC']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                        >

                            <Text className={`flex-row ${isDark ? 'text-white' : 'text-black'} text-[25px] font-bold justify-center items-center opacity-0 `}>{t("appName")}</Text>
                        </LinearGradient>
                    </MaskedView>
                </View>
                <TouchableOpacity onPress={feedPreferencesModalView}>
                    <GlassView
                        isInteractive={true}
                        glassEffectStyle='regular'
                        tintColor={isDark ? '#1f2937' : 'white'}
                        style={{
                            borderRadius: 24,
                            width: 48,
                            height: 48,
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}
                    >
                        {isDark ? (
                            <MaterialIcons name="settings" size={20} color="white" />
                        ) : (
                            <MaterialIcons name="settings" size={20} color="black" />
                        )}
                    </GlassView>
                </TouchableOpacity>

            </View>

        </>
    );
}