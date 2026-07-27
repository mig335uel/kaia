import { Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
    const { t } = useTranslation();
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={
                {
                    title: t("home"),
                    tabBarIcon: ({ color, size }) => (
                        <Octicons name="home" size={size} color={color} />
                    ),
                    
                }
            } />
        </Tabs>
    );
}