import { useEffect, useState, useRef, useCallback } from "react";
import { KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, FlatList, Keyboard, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
    getFirestore,
    doc,
    collection,
    onSnapshot,
    query,
    orderBy,
    addDoc,
    serverTimestamp,
    updateDoc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc
} from '@react-native-firebase/firestore';
import useAuth from "@/hooks/useAuth";
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
    Easing,
    FadeIn,
    FadeInDown,
    SlideInRight,
    SlideInLeft,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { GlassView } from "expo-glass-effect";
import { Ionicons } from "@expo/vector-icons";

// ─── Tipados ────────────────────────────────────────────────
interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: any;
}

interface ChatData {
    createdAtEpoch: number;
    isPermanent: boolean;
    likes: Record<string, boolean>;
}

// ─── Componentes auxiliares ─────────────────────────────────

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.createAnimatedComponent(View);

interface TimerProps {
    duration: number;
    size?: number;
}

function CircularTimer({ duration, size = 200 }: TimerProps) {
    const strokeWidth = size / 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = useSharedValue(1);

    useEffect(() => {
        progress.value = withTiming(0, {
            duration: duration * 1000,
            easing: Easing.linear,
        });
    }, [duration]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - progress.value),
    }));

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#D946EF"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
        </View>
    );
}

// ─── Burbuja de chat (bocadillo) ────────────────────────────

interface BubbleProps {
    message: Message;
    isMe: boolean;
    showTail: boolean; // Solo la última burbuja consecutiva del mismo user lleva "cola"
}

function ChatBubble({ message, isMe, showTail }: BubbleProps) {
    const enterAnim = isMe ? SlideInRight.duration(300) : SlideInLeft.duration(300);

    // Formato de hora
    const time = message.timestamp
        ? new Date(message.timestamp.toMillis()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <AnimatedView
            entering={enterAnim}
            style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '78%',
                marginBottom: showTail ? 12 : 3,
            }}
        >
            {isMe ? (
                <View>
                    <LinearGradient
                        colors={['#6366F1', '#8B5CF6', '#D946EF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: showTail ? 4 : 20,
                            // Sombra sutil del color del gradiente
                            shadowColor: '#8B5CF6',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.25,
                            shadowRadius: 6,
                            elevation: 4,
                        }}
                    >
                        <Text style={styles.bubbleText}>{message.text}</Text>
                        <Text style={[styles.timeText, { textAlign: 'right' }]}>{time}</Text>
                    </LinearGradient>
                    {/* Cola / pico del bocadillo */}
                    {showTail && (
                        <View style={{
                            position: 'absolute',
                            bottom: -6,
                            right: 8,
                            width: 0,
                            height: 0,
                            borderLeftWidth: 8,
                            borderLeftColor: 'transparent',
                            borderTopWidth: 8,
                            borderTopColor: '#D946EF',
                            borderRightWidth: 0,
                            borderRightColor: 'transparent',
                        }} />
                    )}
                </View>
            ) : (
                <View>
                    <View style={{
                        backgroundColor: 'rgba(255,255,255,0.07)',
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        borderBottomLeftRadius: showTail ? 4 : 20,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.1)',
                    }}>
                        <Text style={styles.bubbleText}>{message.text}</Text>
                        <Text style={[styles.timeText, { textAlign: 'left' }]}>{time}</Text>
                    </View>
                    {/* Cola / pico del bocadillo */}
                    {showTail && (
                        <View style={{
                            position: 'absolute',
                            bottom: -6,
                            left: 8,
                            width: 0,
                            height: 0,
                            borderRightWidth: 8,
                            borderRightColor: 'transparent',
                            borderTopWidth: 8,
                            borderTopColor: 'rgba(255,255,255,0.07)',
                            borderLeftWidth: 0,
                            borderLeftColor: 'transparent',
                        }} />
                    )}
                </View>
            )}
        </AnimatedView>
    );
}

// ─── Pantalla principal del chat ────────────────────────────

export default function ChatRoom() {
    const { chatId } = useLocalSearchParams<{ chatId: string }>();
    const user = useAuth();
    const db = getFirestore();

    // Estados
    const [messages, setMessages] = useState<Message[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(300);
    const [isPermanent, setIsPermanent] = useState<boolean>(false);
    const [iLiked, setILiked] = useState<boolean>(false);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList>(null);

    // Ref para saber cuándo empezó esta sesión exacta y poder filtrar mensajes viejos
    const sessionStartEpoch = useRef<number | null>(null);

    // 1. Escuchar el documento principal del chat (Temporizador y Estado)
    useEffect(() => {
        if (!chatId || !user) return;

        const chatRef = doc(db, 'chats', chatId);

        const unsubscribe = onSnapshot(chatRef, (documentSnapshot) => {
            if (!documentSnapshot.exists || (typeof documentSnapshot.exists === 'function' && !documentSnapshot.exists())) {
                setTimeout(() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/(home)/(SocialMode)/(tabs)');
                    }
                }, 100);
                return;
            }

            const data = documentSnapshot.data() as ChatData;

            const currentIsPermanent = data.isPermanent || false;
            const likes = data.likes || {};
            const myLikeStatus = likes[user.id] || false;

            setIsPermanent(currentIsPermanent);
            setILiked(myLikeStatus);

            if (data.createdAtEpoch && !sessionStartEpoch.current) {
                sessionStartEpoch.current = data.createdAtEpoch;
            }

            if (data.createdAtEpoch && !currentIsPermanent) {
                const nowEpoch = Date.now();
                const diffSeconds = Math.floor((nowEpoch - data.createdAtEpoch) / 1000);
                const remaining = 300 - diffSeconds;

                if (remaining <= 0) {
                    setTimeLeft(0);
                    handleTimeUp();
                } else {
                    setTimeLeft(remaining);
                }
            }
        });

        return () => unsubscribe();
    }, [chatId, user]);

    // 2. Temporizador local
    useEffect(() => {
        if (isPermanent || timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [isPermanent, timeLeft]);

    // 3. Escuchar la subcolección de mensajes (Con filtro de historial)
    useEffect(() => {
        if (!chatId) return;

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs: Message[] = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();

                // LÓGICA DE FILTRADO:
                if (!isPermanent && data.timestamp && sessionStartEpoch.current) {
                    const msgTime = data.timestamp.toMillis();
                    if (msgTime < sessionStartEpoch.current) {
                        return;
                    }
                }

                msgs.push({
                    id: docSnap.id,
                    senderId: data.senderId,
                    text: data.text,
                    timestamp: data.timestamp,
                });
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [chatId, isPermanent]);

    // --- FUNCIONES DE ACCIÓN ---

    const handleTimeUp = async () => {
        if (isPermanent || !chatId) return;

        try {
            const chatRef = doc(db, 'chats', chatId);

            const messagesRef = collection(chatRef, 'messages');
            const messagesSnap = await getDocs(messagesRef);

            let oldMessagesCount = 0;

            const deletePromises = messagesSnap.docs.map((msgDoc) => {
                const data = msgDoc.data();
                const msgTime = data.timestamp ? data.timestamp.toMillis() : Date.now();

                if (sessionStartEpoch.current && msgTime >= sessionStartEpoch.current) {
                    return deleteDoc(msgDoc.ref);
                } else {
                    oldMessagesCount++;
                    return Promise.resolve();
                }
            });

            await Promise.all(deletePromises);

            if (oldMessagesCount === 0) {
                await deleteDoc(chatRef);
            } else {
                await updateDoc(chatRef, {
                    isPermanent: true
                });
            }
        } catch (error) {
            console.error("Error borrando el chat al acabar el tiempo:", error);
        }

        setTimeout(() => {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/(home)/(SocialMode)/(tabs)');
            }
        }, 100);
    };

    const sendMessage = async () => {
        const text = inputText.trim();
        if (!text || !chatId || !user) return;

        setInputText("");

        const chatRef = doc(db, 'chats', chatId);
        const messagesRef = collection(chatRef, 'messages');

        await addDoc(messagesRef, {
            senderId: user.id,
            text: text,
            timestamp: serverTimestamp(),
        });

        await updateDoc(chatRef, {
            lastMessage: text,
            lastMessageTime: serverTimestamp(),
        });
    };

    const toggleLike = async () => {
        if (iLiked || !chatId || !user) return;

        const chatRef = doc(db, 'chats', chatId);

        await setDoc(chatRef, {
            likes: {
                [user.id]: true
            }
        }, { merge: true });

        const docSnap = await getDoc(chatRef);
        if (docSnap.exists()) {
            const likes = docSnap.data()?.likes || {};
            const userIds = Object.keys(likes);

            const bothLiked = userIds.length >= 2 && userIds.every(id => likes[id] === true);

            if (bothLiked) {
                await updateDoc(chatRef, {
                    isPermanent: true
                });
                console.log("¡Chat permanente activado! Historial revelado.");
            }
        }
    };

    // Formato mm:ss para el temporizador
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // ─── RENDER ─────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                {/* ──── BARRA SUPERIOR ──── */}
                <View style={styles.appBar}>
                    <View style={styles.appBarLeft}>
                        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={{ padding: 4 }}>
                            <Ionicons name="chevron-back" size={26} color="white" />
                        </TouchableOpacity>

                        {!isPermanent ? (
                            <View style={styles.timerPill}>
                                <CircularTimer duration={timeLeft} size={24} />
                                <Text style={[
                                    styles.timerText,
                                    timeLeft <= 60 && { color: '#EF4444' } // Rojo si queda < 1 min
                                ]}>
                                    {formatTime(timeLeft)}
                                </Text>
                            </View>
                        ) : (
                            <AnimatedView entering={FadeIn.duration(500)}>
                                <LinearGradient
                                    colors={['rgba(99,102,241,0.2)', 'rgba(217,70,239,0.2)']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.permanentBadge}
                                >
                                    <Ionicons name="infinite" size={18} color="#D946EF" />
                                    <Text style={styles.permanentText}>Conectados</Text>
                                </LinearGradient>
                            </AnimatedView>
                        )}
                    </View>

                    {!isPermanent && (
                        <TouchableOpacity disabled={iLiked} onPress={toggleLike} activeOpacity={0.7}>
                            <LinearGradient
                                colors={iLiked ? ['#D946EF', '#EC4899'] : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[
                                    styles.likeButton,
                                    iLiked && styles.likeButtonActive,
                                ]}
                            >
                                <Ionicons
                                    name={iLiked ? "heart" : "heart-outline"}
                                    size={18}
                                    color={iLiked ? "white" : "rgba(255,255,255,0.8)"}
                                />
                                <Text style={[
                                    styles.likeText,
                                    iLiked && { color: 'white' }
                                ]}>
                                    {iLiked ? "Liked!" : "Like"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>

                {/* ──── LISTA DE MENSAJES ──── */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    inverted
                    contentContainerStyle={styles.messagesList}
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="chatbubble-ellipses-outline" size={48} color="rgba(255,255,255,0.15)" />
                            <Text style={styles.emptyText}>Di algo... ¡tienes {formatTime(timeLeft)}!</Text>
                        </View>
                    }
                    renderItem={({ item, index }) => {
                        const isMe = item.senderId === user!.id;
                        // La "cola" del bocadillo solo se muestra en el último mensaje consecutivo del mismo usuario
                        const nextMessage = messages[index + 1];
                        const showTail = !nextMessage || nextMessage.senderId !== item.senderId;

                        return (
                            <ChatBubble
                                message={item}
                                isMe={isMe}
                                showTail={showTail}
                            />
                        );
                    }}
                />

                {/* ──── BARRA DE INPUT ──── */}
                <View style={styles.inputBar}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            value={inputText}
                            onChangeText={setInputText}
                            style={styles.textInput}
                            placeholder="Escribe un mensaje..."
                            placeholderTextColor="rgba(255,255,255,0.35)"
                            multiline
                            maxLength={500}
                            onSubmitEditing={sendMessage}
                            blurOnSubmit={false}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={sendMessage}
                        activeOpacity={0.8}
                        disabled={!inputText.trim()}
                    >
                        <LinearGradient
                            colors={inputText.trim() ? ['#6366F1', '#D946EF'] : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.sendButton}
                        >
                            <Ionicons
                                name="send"
                                size={18}
                                color={inputText.trim() ? "white" : "rgba(255,255,255,0.25)"}
                                style={{ marginLeft: 2 }}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Estilos ────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },

    // ── App Bar ──
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    appBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    timerPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    timerText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 15,
        fontVariant: ['tabular-nums'], // Monospace para que no salte al cambiar dígitos
    },
    permanentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(217,70,239,0.2)',
    },
    permanentText: {
        color: '#D946EF',
        fontWeight: '700',
        fontSize: 14,
    },

    // ── Like Button ──
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    likeButtonActive: {
        borderColor: 'rgba(217,70,239,0.4)',
        shadowColor: '#D946EF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    likeText: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        fontSize: 14,
    },

    // ── Messages ──
    messagesList: {
        paddingHorizontal: 14,
        paddingVertical: 16,
        flexGrow: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        transform: [{ scaleY: -1 }], // Invertimos porque FlatList está inverted
        paddingBottom: 60,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: 15,
        fontWeight: '500',
    },

    // ── Bubble ──
    bubbleText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 22,
    },
    timeText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        marginTop: 4,
    },

    // ── Input Bar ──
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'ios' ? 6 : 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        minHeight: 48,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    textInput: {
        color: 'white',
        fontSize: 16,
        maxHeight: 100,
        lineHeight: 22,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});