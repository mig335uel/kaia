import useAuth from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { Platform, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SocialMatchMakingController } from "@/Controller/SocialMatchMakingController";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';

const PulseRing = ({ delay }: { delay: number }) => {
    const ring = useSharedValue(0);

    useEffect(() => {
        ring.value = withDelay(
            delay,
            withRepeat(
                withTiming(1, {
                    duration: 2500,
                    easing: Easing.out(Easing.ease),
                }),
                -1,
                false
            )
        );
    }, [delay, ring]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: 1 - ring.value,
            transform: [{ scale: 1 + ring.value * 2 }], 
        };
    });

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    width: 130,
                    height: 130,
                    borderRadius: 65,
                    borderWidth: 2,
                    borderColor: 'rgba(217, 70, 239, 0.6)',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                },
                animatedStyle,
            ]}
        />
    );
};

export default function TextGame() {
    const user = useAuth();
    const textSocialMatchMaking = new SocialMatchMakingController();

    useEffect(() => {
        if (!user) return;

        const iniciar = async () => {
            await textSocialMatchMaking.iniciarBusqueda((chatId: string) => {
                // ¡MATCH ENCONTRADO! Navegamos al chat
                console.log("¡Match encontrado! Navegando al chat:", chatId);
                router.replace(`/(home)/(SocialMode)/TextMatchMaking/${chatId}`);
            });
        };

        iniciar();

        // Cleanup: cancelar búsqueda si el usuario sale de la pantalla
        return () => {
            textSocialMatchMaking.cancelarBusqueda();
        };
    }, [user]);

    const cancelMatcMaking = async () => {
        try {
            await textSocialMatchMaking.cancelarBusqueda();
            router.back();
        } catch (error) {
            console.error('Error cancelando matchmaking:', error);
        }
    }

    return (
        <SafeAreaView edges={Platform.OS === 'ios' ? ['top']: ['top', 'bottom']} style={{ flex: 1, backgroundColor: '#0F172A' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flex: 1 }} />
                
                {/* CENTRO ANIMADO (El Orbe de conexión) */}
                <View style={{ width: 130, height: 130, justifyContent: 'center', alignItems: 'center' }}>
                    <PulseRing delay={0} />
                    <PulseRing delay={833} />
                    <PulseRing delay={1666} />
                    
                    <View style={styles.shadowWrapper}>
                        <LinearGradient
                            colors={['#6366F1', '#D946EF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: 130,
                                height: 130,
                                borderRadius: 65,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="chatbubble" size={55} color="white" />
                        </LinearGradient>
                    </View>
                </View>

                <View style={{ height: 70 }} />
                
                {/* TEXTO ANIMADO Y ESTILIZADO */}
                <Text style={{
                    color: 'white',
                    fontSize: 26,
                    fontWeight: 'bold',
                    letterSpacing: 0.5,
                }}>
                    Buscando conexión...
                </Text>
                <View style={{ height: 12 }} />
                <Text style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 16,
                    letterSpacing: 0.2,
                }}>
                    El destino está haciendo su magia ✧
                </Text>

                <View style={{ flex: 1 }} />
                
                {/* BOTÓN DE CANCELAR */}
                <View style={{ paddingHorizontal: 40, paddingVertical: 40, width: '100%' }}>
                    <TouchableOpacity onPress={cancelMatcMaking} activeOpacity={0.8}>
                        {Platform.OS === 'ios' ? (
                            <GlassView
                                glassEffectStyle="regular"
                                style={{
                                    borderRadius: 30,
                                    overflow: 'hidden',
                                }}
                            >
                                <View style={styles.cancelButtonContent}>
                                    <Ionicons name="close" size={22} color="rgba(255,255,255,0.7)" />
                                    <Text style={styles.cancelButtonText}>
                                        Cancelar búsqueda
                                    </Text>
                                </View>
                            </GlassView>
                        ) : (
                            <View style={[styles.cancelButtonContent, styles.androidCancelButton]}>
                                <Ionicons name="close" size={22} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.cancelButtonText}>
                                    Cancelar búsqueda
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    shadowWrapper: {
        shadowColor: '#D946EF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 10,
    },
    cancelButtonContent: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    androidCancelButton: {
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
});