import { EvilIcons, Foundation, Ionicons, MaterialIcons, Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: isDark ? '#374151' : '#e5e7eb',
                    height: 70,
                    paddingBottom: 8,
                    paddingTop: 8,
                    elevation: 10, // Sombra clásica en Android
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarActiveTintColor: isDark ? '#3FCECC' : '#8E2DE2', // Color principal morado
                tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280', // Gris para inactivos
                tabBarShowLabel: false,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: -2,
                }
            }}
        >
            <Tabs.Screen 
                name="index" 
                options={{
                    title: t('home'),
                    tabBarIcon: ({ color, size }) => (
                        <Octicons name="home" size={24} color={color} />
                    ),
                }} 
            />
            
            <Tabs.Screen 
                name="discover" 
                options={{
                    title: t('discover', 'Descubrir'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="earth" size={26} color={color} />
                    ),
                }} 
            />
            <Tabs.Screen name="messages" options={{
                title: t('messages'),
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="paper-plane-outline" size={26} color={color} />
                ),
            }} />
        </Tabs>
    );
}