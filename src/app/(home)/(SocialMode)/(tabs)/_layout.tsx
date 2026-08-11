import { EvilIcons, Foundation, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { LiquidGlassIndicator } from "@/Components/LiquidGlassTabBar";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  useColorScheme,
  View,
  DeviceEventEmitter,
  LayoutChangeEvent,
} from 'react-native';
import { BlurView } from "expo-blur";
import { useState } from "react";
const VISIBLE_TABS = ['index'];
export default function TabLayout() {
    const { t } = useTranslation();
    const isDark = useColorScheme() === 'dark';
    const [activeIndex, setActiveIndex] = useState<number>(0);
    // ── Medimos el ancho REAL de la barra con onLayout para posicionar
    //    la píldora exactamente sobre cada icono, sin cálculos manuales.
    const [barWidth, setBarWidth] = useState<number>(0);
    function onBarLayout(event: LayoutChangeEvent): void {
        setBarWidth(event.nativeEvent.layout.width);
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle:{
                    
                    backgroundColor: isDark ? 'black' : 'white',
                    
                    
                    // borderColor: isDark ? 'rgba(29,161,242,0.35)' : 'rgba(29,161,242,0.22)',
                    // borderTopColor: isDark ? 'rgba(29,161,242,0.45)' : 'rgba(29,161,242,0.30)',
                    
                },
                tabBarShowLabel: false
            }}
            
        >
            <Tabs.Screen name="index" options={{
                title: t('home'),
                tabBarIcon: ({ color, size }) => (
                    <Octicons name="home-fill" size={size} color={color} />
                ),
            }} />
        </Tabs>
    );
}