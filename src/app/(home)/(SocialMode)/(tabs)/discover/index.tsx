import { Ionicons } from "@expo/vector-icons";
import { View, Text, useColorScheme, Pressable, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";





export default function DiscoverIndex() {
    const isDark = useColorScheme() === "dark";
    const insets = useSafeAreaInsets();
    return (
        <>
            <View className={`flex flex-1 items-center justify-center ${isDark ? 'bg-[#1f2937]' : 'bg-white'}`}>
                <Text className={`${isDark ? 'text-white' : 'text-black'}`}>Discover</Text>
            </View>


            <Pressable onPress={() => { Alert.alert("Add New Post", `you are creating a new post for the {feed} feed`, [
                {
                    
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    
                    style: "destructive"
                },
                {
                    text: "OK",
                    onPress: () => console.log("OK Pressed"),
                    style:"default"
                }
            ]); }} style={{
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

                        <Ionicons name="add-sharp" size={48} color={isDark ? 'white' : 'black'} />
                    </LinearGradient>
  
            </Pressable>
        </>
    );
}