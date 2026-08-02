
import { View, Text, TouchableOpacity } from 'react-native';
import { BlurView, BlurTargetView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Ionicons, Octicons, Zocial, Entypo } from '@expo/vector-icons';




export function Cards() {
    const { t } = useTranslation();


    return (
        <View className='w-full flex flex-row items-center justify-around'>
            {/* Left Card: Chat */}
            <TouchableOpacity
                style={{
                    shadowColor: "#8A7CFF", // Outer glow color
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.9,
                    shadowRadius: 20,
                    elevation: 15,
                }}
            >
                <LinearGradient
                    colors={['#8A7CFF', '#4BCBD4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 32,
                        paddingVertical: 20,
                        paddingHorizontal: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                        // 3D Glass edge effect
                        borderTopWidth: 2,
                        borderLeftWidth: 2,
                        borderBottomWidth: 1,
                        borderRightWidth: 1,
                        borderTopColor: 'rgba(255,255,255,0.5)',
                        borderLeftColor: 'rgba(255,255,255,0.5)',
                        borderBottomColor: 'rgba(255,255,255,0.1)',
                        borderRightColor: 'rgba(255,255,255,0.1)',
                    }}
                >
                    {/* Inner circle for icon */}
                    <View style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 15,
                    }}>
                        <Ionicons name='chatbubbles-outline' size={35} color='white' />
                    </View>
                    <Text style={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 'bold',
                        textShadowColor: 'rgba(0,0,0,0.3)',
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 4
                    }}>
                        {t('chatGame')}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Right Card: Voice */}
            <TouchableOpacity
                style={{
                    shadowColor: "#4BCBD4", // Outer glow color
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.9,
                    shadowRadius: 20,
                    elevation: 15,
                }}
            >
                <LinearGradient
                    colors={['#4BCBD4', '#6D65F3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        width: 160,
                        height: 160,
                        borderRadius: 32,
                        paddingVertical: 20,
                        paddingHorizontal: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                        // 3D Glass edge effect
                        borderTopWidth: 2,
                        borderLeftWidth: 2,
                        borderBottomWidth: 1,
                        borderRightWidth: 1,
                        borderTopColor: 'rgba(255,255,255,0.5)',
                        borderLeftColor: 'rgba(255,255,255,0.5)',
                        borderBottomColor: 'rgba(255,255,255,0.1)',
                        borderRightColor: 'rgba(255,255,255,0.1)',
                    }}
                >
                    {/* Inner circle for icon */}
                    <View style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 15,
                    }}>
                        <Entypo name='mic' size={35} color='white' />
                    </View>
                    <Text style={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 'bold',
                        textShadowColor: 'rgba(0,0,0,0.3)',
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 4
                    }}>
                        {t('voiceGame')}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}