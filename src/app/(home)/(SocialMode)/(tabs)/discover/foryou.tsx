import { Ionicons } from "@expo/vector-icons";
import { View, Text, useColorScheme, Pressable, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useState } from "react";
import KaiaPostsCreator from "@/Components/KaiaPostsCreator/main";





export default function DiscoverIndex() {
    const isDark = useColorScheme() === "dark";
    const insets = useSafeAreaInsets();

    const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
    
    return (
        <>
            <View className={`flex flex-1 ${isDark ? 'bg-[#1f2937]' : 'bg-white' } items-center justify-center`} >
                <Text className={`${isDark ? 'text-white' : 'text-black'}`}>Discover</Text>
            </View>

            {isCreatePostVisible && (
                <KaiaPostsCreator isVisible={isCreatePostVisible} setIsVisible={setIsCreatePostVisible} />
            )}
            
            <Pressable onPress={() => { setIsCreatePostVisible(true); }} style={{
                position: "absolute",
                bottom: insets.bottom + 15,
                right: insets.right + 20,
                borderRadius: 9999,
            }}>
                

                    <LinearGradient
                        colors={['#6A5BFC', '#7575FF', '#3FCECC']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{
                            borderRadius: 9999,
                            padding: 6
                        }}>

                        <Ionicons name="add" size={48} color={'white'} />
                    </LinearGradient>
  
            </Pressable>
        </>
    );
}