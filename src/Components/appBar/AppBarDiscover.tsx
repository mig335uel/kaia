import { Text, View } from "react-native";





export function AppBarDiscover({ isDark }: { isDark: boolean }) {
    return (
        <View className={`flex-row items-center justify-between px-6 ${isDark ? 'bg-[#1f2937]' : 'bg-white'} relative`}>
            <View className="w-10 h-10" />
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Descubrir
            </Text>
            <View className="w-10 h-10" />
        </View>
    );
}