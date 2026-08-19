import { View, Text, TouchableOpacity, useColorScheme, TextInput } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { useTranslation } from "react-i18next";
import { Profile } from "@/Types/Users";

export function InboxAppBar({ user }: { user: Profile | null }) {
    const isDark = useColorScheme() === 'dark';
    const { t } = useTranslation();
    return (
        
        <View className={`flex-col border border-t-0 border-l-0 border-r-0 ${isDark ? 'bg-[#1f2937]' : 'bg-white'} relative`}>
            <View className={`flex-row items-center  justify-between px-6`}>
                <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{t('inbox')}</Text>
                <TouchableOpacity className="mb-1.5">
                    <GlassView isInteractive={true} glassEffectStyle='regular' tintColor={isDark ? '#1f2937' : 'white'} style={
                        {
                            borderRadius: 9999,
                            padding: 10,
                        }
                    }>
                        <Octicons name="pencil" size={20} color={isDark ? 'white' : 'black'} />
                    </GlassView>
                </TouchableOpacity>
            </View>
            <GlassView isInteractive={false} glassEffectStyle='regular' tintColor={isDark ? '#1f2937' : 'white'} style={{
                borderRadius: 50,
                backgroundColor: isDark ? '#1f2937' : 'white',
                marginHorizontal: 5,
                marginBottom: 5,
            }}>
                <TextInput
                    placeholder={t('search')}
                    autoCorrect={false}
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    className={`w-full px-4 py-3 text-base ${isDark ? 'text-white' : 'text-black'}`}
                />
            </GlassView>
        </View>
    )
}