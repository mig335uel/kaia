import { MaterialTopTabs } from "@/Components/MaterialTopBar";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme, Text } from "react-native";
import { Header } from "expo-router/react-navigation";
import { AppBarDiscover } from "@/Components/appBar/AppBarDiscover";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";



export default function DiscoverLayout() {
    const { t } = useTranslation();
    const isDark = useColorScheme() === "dark";
    return (
        <SafeAreaView style={{ flex: 1 }} className={`${isDark ? 'bg-[#1f2937]' : 'bg-white'}`} edges={['top']}>
     
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
                        height: 45, // Fix height to prevent jumping
                        justifyContent: 'center',
                    },
                    tabBarScrollEnabled: true, // Makes tabs left-aligned and scrollable
                    tabBarActiveTintColor: isDark ? 'white' : '#111827',
                    tabBarInactiveTintColor: isDark ? '#6b7280' : '#d1d5db',
                    tabBarPressColor: 'transparent', // Remove the default ripple effect
                    tabBarLabel: ({ focused, color, children }) => {
                        if (focused) {
                            return (
                                <MaskedView
                                    maskElement={<Text style={{ fontSize: 28, fontWeight: '900', letterSpacing: -0.5 }} className={isDark ? 'text-white' : 'text-black'}>{children}</Text>}
                                >
                                    <LinearGradient
                                        colors={['#6A5BFC', '#7575FF', '#3FCECC']}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                    >
                                        <Text style={{ fontSize: 28, fontWeight: '900', letterSpacing: -0.5, opacity: 0 }}>{children}</Text>
                                    </LinearGradient>
                                </MaskedView>
                            );
                        }
                        
                        return (
                            <Text style={{ fontSize: 18, fontWeight: '700', color: color, letterSpacing: -0.5 }}>
                                {children}
                            </Text>
                        );
                    }
                }}
                
                headerMode='screen'
            >
                <MaterialTopTabs.Screen name="foryou" options={{ title: t("foryou") }} />
                <MaterialTopTabs.Screen name="following" options={{ title: t("following") }} />
            </MaterialTopTabs>
        </SafeAreaView>
    );
}