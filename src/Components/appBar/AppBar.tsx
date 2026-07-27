import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import { Ionicons, Octicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { GlassView } from "expo-glass-effect";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";



export function AppBar({ isDark, feedPreferencesModalView }: { isDark: boolean, feedPreferencesModalView: () => void }) {
    const { t } = useTranslation();
    return (
        <>
            <View className={`flex-row items-center justify-between px-6 ${isDark ? 'bg-black' : 'bg-white'} relative`}>
                <Image
                    source={require('../../../assets/Kaia.png')}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                />
                <MaskedView
                    maskElement={<Text className={`flex-row ${isDark ? 'text-white' : 'text-black'} text-[25px] font-bold justify-center items-center `}>{t("appName")}</Text>}>
                    <LinearGradient
                        colors={['#8E2DE2', '#4A00E0']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text className={`flex-row ${isDark ? 'text-white' : 'text-black'} text-[25px] font-bold justify-center items-center opacity-0 `}>{t("appName")}</Text>
                    </LinearGradient>
                </MaskedView>
                <TouchableOpacity onPress={feedPreferencesModalView}>
                    <GlassView
                        isInteractive={true}
                        glassEffectStyle='regular'
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