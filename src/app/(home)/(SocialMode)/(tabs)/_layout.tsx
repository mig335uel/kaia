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
            screenListeners={{
                tabPress: (e) => {
                    const tabName = (e.target as string)?.split('-')[0];
                    const idx = VISIBLE_TABS.indexOf(tabName);
                    if (idx !== -1) setActiveIndex(idx);
                },
                state: (e) => {
                    const routes = e.data?.state?.routes as any[];
                    const index = e.data?.state?.index as number;
                    if (routes && index != null) {
                        const name = routes[index]?.name;
                        const idx = VISIBLE_TABS.indexOf(name);
                        if (idx !== -1) setActiveIndex(idx);
                    }
                },
            }}
            screenOptions={{
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    shadowColor: '#1DA1F2',
                    shadowOpacity: 0.18,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 4 },
                    backfaceVisibility: 'hidden',
                    borderStyle: 'solid',
                    borderWidth: 0.8,
                    borderColor: isDark ? 'rgba(29,161,242,0.35)' : 'rgba(29,161,242,0.22)',
                    borderTopColor: isDark ? 'rgba(29,161,242,0.45)' : 'rgba(29,161,242,0.30)',
                    bottom: 24,
                    left: 12,
                    right: 12,
                    height: 70,
                    borderRadius: 35,
                    borderTopWidth: 0,
                    marginHorizontal: 4,
                    elevation: 0,
                },
                tabBarItemStyle: {
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 14,
                },
                tabBarIconStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                },

                tabBarShowLabel: false,
                headerShown: false,
                tabBarBackground: () => (
                    // onLayout mide el ancho exacto que React Native asigna a la barra
                    <View style={StyleSheet.absoluteFill} onLayout={onBarLayout}>
                        {/* Fondo blur — cristal base */}
                        <BlurView
                            intensity={100}
                            tint={isDark ? 'dark' : 'light'}
                            blurReductionFactor={50}
                            style={[StyleSheet.absoluteFill, { borderRadius: 30, overflow: 'hidden' }]}
                        />
                        {/* Píldora Liquid Glass que salta entre tabs */}
                        {barWidth > 0 && (
                            <LiquidGlassIndicator
                                activeIndex={activeIndex}
                                tabCount={VISIBLE_TABS.length}
                                barWidth={barWidth}
                            />
                        )}
                    </View>
                ),
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