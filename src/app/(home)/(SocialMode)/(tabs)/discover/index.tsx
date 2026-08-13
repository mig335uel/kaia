import { View, Text, useColorScheme } from "react-native";





export default function DiscoverIndex() {
    const isDark = useColorScheme() === "dark";
    return (
        <View className={`${isDark ? 'bg-black' : 'bg-white'}`}>
            <Text className={`${isDark ? 'text-white' : 'text-black'}`}>Discover</Text>
        </View>
    );
}