import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";




export default function InboxLayout() {
    const isDark = useColorScheme() === 'dark';


    return (
        <SafeAreaView style={{ flex: 1 }} className={`${isDark ? 'bg-[#1f2937]' : 'bg-white'}`} edges={['top']}>

            <Stack screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="inbox" options={{
                    headerShown: false
                }} />
            </Stack>
        </SafeAreaView>
    )
}