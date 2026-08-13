import { MaterialTopTabs } from "@/Components/MaterialTopBar";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Header } from "expo-router/react-navigation";
import { AppBarDiscover } from "@/Components/appBar/AppBarDiscover";



export default function DiscoverLayout() {
    const { t } = useTranslation();
    const isDark = useColorScheme() === "dark";
    return (
        <SafeAreaView style={{ flex: 1 }} className={`${isDark ? 'bg-[#1f2937]' : 'bg-white'}`} edges={['top']}>
            <AppBarDiscover isDark={isDark} />
            <MaterialTopTabs
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: 'transparent',
                        elevation: 0, // Remove shadow on Android
                        shadowOpacity: 0, // Remove shadow on iOS
                        marginTop: 10,
                    },
                    tabBarIndicatorStyle: {
                        height: 0, // Hidden indicator for a clean minimalist look
                    },
                    tabBarItemStyle: {
                        width: 'auto', // Hugs the text width
                        paddingHorizontal: 16,
                        paddingVertical: 0,
                    },
                    tabBarScrollEnabled: true, // Makes tabs left-aligned and scrollable
                    tabBarLabelStyle: {
                        fontWeight: '900', // Very bold
                        textTransform: 'none', // Remove uppercase default
                        fontSize: 28, // Big typography
                        letterSpacing: -0.5,
                    },
                    tabBarActiveTintColor: isDark ? 'white' : '#111827',
                    tabBarInactiveTintColor: isDark ? '#6b7280' : '#d1d5db',
                    tabBarPressColor: 'transparent', // Remove the default ripple effect
                    
                }}
                
                headerMode='screen'
            >
                <MaterialTopTabs.Screen name="index" options={{ title: t("foryou") }} />
            </MaterialTopTabs>
        </SafeAreaView>
    );
}