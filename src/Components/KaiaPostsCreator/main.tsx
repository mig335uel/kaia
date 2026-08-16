import { Text, View, TextInput, useColorScheme, TouchableOpacity, Modal, PanResponder, Animated, KeyboardAvoidingView } from "react-native";
import { useRef, useEffect, useState } from "react";
import KaiaPostsTextEditor from "./TextEditor";



interface PostCreator {

    content: string;
}

export default function KaiaPostsCreator({ isVisible, setIsVisible }: { isVisible: boolean, setIsVisible: (isVisible: boolean) => void }) {
    const isDark = useColorScheme() === "dark";
    const panY = useRef(new Animated.Value(0)).current;
    const [newPost, setNewPost] = useState<PostCreator>({
        content: "",
    });


    // Reseteamos la posición cuando se abre el modal
    useEffect(() => {
        if (isVisible) {
            panY.setValue(0);
        }
    }, [isVisible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (e, gestureState) => {
                // Solo activamos el pan si el movimiento principal es vertical (hacia abajo)
                return gestureState.dy > 10 && Math.abs(gestureState.dx) < 20;
            },
            onPanResponderMove: (e, gestureState) => {
                if (gestureState.dy > 0) {
                    panY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 150 || gestureState.vy > 1.5) {
                    // Si bajó más de 150px o hizo un swipe rápido (velocidad alta), cerramos
                    setIsVisible(false);
                } else {
                    // Si no, devolvemos el modal a su sitio con una animación suave
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            }
        })
    ).current;

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(!isVisible);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',

                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                >
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={() => setIsVisible(false)}
                    />
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={{
                            backgroundColor: isDark ? '#1f2937' : 'white',
                            borderTopLeftRadius: 25,
                            borderTopRightRadius: 25,
                            padding: 20,
                            alignItems: 'center',

                            minHeight: '70%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 10,
                            elevation: 5,
                            transform: [{ translateY: panY }]
                        }}
                    >
                        {/* Pequeña barra superior para indicar que es deslizable (opcional pero muy recomendado) */}
                        <View style={{ width: 40, height: 5, backgroundColor: isDark ? '#3a3a3c' : '#d1d1d6', borderRadius: 3, marginBottom: 20 }} />
                        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, width: '100%' }}>
                            <KaiaPostsTextEditor content={newPost.content} setContent={(content: string) => setNewPost({ ...newPost, content })} />
                        </KeyboardAvoidingView>
                    </Animated.View>
                </View>

            </Modal>
        </>
    );
} 