import { EvilIcons, Foundation, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/build/native-tabs";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

export default function TabLayout() {
    const { t } = useTranslation();
    const isDark = useColorScheme() === 'dark';
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: isDark ? 'black' : 'white',
                borderTopWidth: 0
                
            },
            tabBarShowLabel: false,
            
        }
        }>
            <Tabs.Screen name="index" options={{ title: t('home'), tabBarIcon: ({ color }) => <Foundation name="home" size={24} color={color} /> }} />
        </Tabs>
    );
}