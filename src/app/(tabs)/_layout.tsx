import { EvilIcons, Foundation, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/build/native-tabs";
import { useTranslation } from "react-i18next";
import { useColorScheme, View } from "react-native";

export default function TabLayout() {
    const { t } = useTranslation();
    const isDark = useColorScheme() === 'dark';
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: isDark ? '#121212' : 'white',
                borderTopColor: isDark ? '#666666' : 'black',
                borderTopWidth: 0.17
            },
            tabBarShowLabel: false,
        }}>
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: t('home'), 
                    tabBarIcon: ({ color }) => (
                        <View style={{  alignItems: 'center', justifyContent: 'center' }}>
                            <Foundation name="home" size={35} color={color} />
                        </View>
                    )
                }} 
            />
        </Tabs>
    );
}