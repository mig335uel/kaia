import { View, Text, TouchableOpacity, useColorScheme, TextInput, Platform } from "react-native";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { useTranslation } from "react-i18next";
import { Profile } from "@/Types/Users";

export function InboxAppBar({ user }: { user: Profile | null }) {
    const isDark = useColorScheme() === 'dark';
    const { t } = useTranslation();
    return (

        <View className={`flex-col border border-t-0 border-l-0 border-r-0 ${isDark ? 'bg-[#1f2937]' : 'bg-white'} ${isDark ? 'border-gray-500/75' : 'border-gray-200/75'} relative`}>
            <View className={`flex-row items-center  justify-between px-6`}>
                <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{t('inbox')}</Text>
                <TouchableOpacity className="mb-1.5">
                    {Platform.OS === 'ios' ? (
                        <GlassView isInteractive={true} glassEffectStyle='regular' tintColor={isDark ? '#1f2937' : 'white'} style={
                            {
                                borderRadius: 9999,
                                padding: 10,
                            }
                        }>
                            <Octicons name="pencil" size={20} color={isDark ? 'white' : 'black'} />
                        </GlassView>
                    ) : (
                        <View className={`${isDark ? 'bg-[#1f2937]' : 'bg-white'} rounded-full p-2.5 border border-gray-300/40`}>
                            <Octicons name="pencil" size={20} color={isDark ? 'white' : 'black'} />
                        </View>
                    )}

                </TouchableOpacity>
            </View>
            {Platform.OS === 'ios' ? (
                <GlassView isInteractive={false} glassEffectStyle='regular' tintColor={isDark ? '#1f2937' : 'white'} style={{
                    borderRadius: 16,
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
            ) : (
                <View style={{
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: isDark ? '#374151' : '#e5e7eb',
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
                </View>
            )}
            
        </View>
    )
}