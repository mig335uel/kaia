import { MaterialTopTabs } from "@/Components/MaterialTopBar";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";



export default function DiscoverLayout() {
    const { t } = useTranslation();
    const isDark = useColorScheme() === "dark";
    return (
        <SafeAreaView style={{ flex: 1 }} className={`${isDark ? 'bg-[#1f2937]' : 'bg-white'}`} edges={['top']}>
            <MaterialTopTabs
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: isDark ? '#374151' : '#f3f4f6',
                        marginHorizontal: 20,
                        marginTop: 10,
                        marginBottom: 10,
                        borderRadius: 25,
                        elevation: 0, // Remove shadow on Android
                        shadowOpacity: 0, // Remove shadow on iOS
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: '#8E2DE2', // Kaia app main purple color
                        height: '100%',
                        borderRadius: 25,
                    },
                    tabBarItemStyle: {
                        borderRadius: 25,
                        paddingVertical: 6,
                    },
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                        textTransform: 'none', // Remove uppercase default
                        fontSize: 15,
                    },
                    tabBarActiveTintColor: 'white',
                    tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
                    tabBarPressColor: 'transparent', // Remove the default ripple effect
                }}
            >
                <MaterialTopTabs.Screen name="index" options={{ title: t("foryou") }} />
            </MaterialTopTabs>
        </SafeAreaView>
    );
}