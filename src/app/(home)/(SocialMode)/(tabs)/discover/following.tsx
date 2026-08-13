import { View, Text, useColorScheme } from "react-native";





export default function FollowingDiscover() {
    const isDark = useColorScheme() === "dark";
    return (
        <View className={`flex-1 ${isDark ? 'bg-[#1f2937]' : 'bg-white'}`}>
            <Text className={`${isDark ? 'text-white' : 'text-black'}`}>Following</Text>
        </View>
    );
}