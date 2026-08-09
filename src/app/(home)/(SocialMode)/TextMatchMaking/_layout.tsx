import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";




export default function TextMatchMakingLayout() {
    return (
        <Stack screenOptions={{
            header: () => {
                return <TouchableOpacity onPress={()=>{
                    router.back()}}>
                    <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
            }
        }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}