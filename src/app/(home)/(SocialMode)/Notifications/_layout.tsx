import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router"
import { Text, TouchableOpacity, useColorScheme, View } from "react-native"




export default function SocialNotificationsLayout() {
    const isDark = useColorScheme() === 'dark';
    return (
        <Stack
            screenOptions={{
                header: ()=>{
                    return(
                        <View>
                            <Text>Notifications</Text>
                        </View>
                    );
                },


                headerLeft: ()=>{
                    return(
                        <TouchableOpacity onPress={()=> router.back()}>
                            <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
                        </TouchableOpacity>
                    );
                }
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    )
}