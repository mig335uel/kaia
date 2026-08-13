import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import { useTranslation } from "react-i18next";



export default function TextMatchMakingLayout() {
    const { t } = useTranslation();
    const isDark = useColorScheme() === 'dark';
    return (
        <Stack screenOptions={{

            headerShown: false
        }}>
            <Stack.Screen name="index" options={{
                headerShown: false
            }} />
            
        </Stack>

    );
}