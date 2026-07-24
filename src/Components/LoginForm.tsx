import { View, Text, Platform, useColorScheme, KeyboardAvoidingView } from "react-native";
import { GlassView } from "expo-glass-effect";

function LoginFormIOS() {
    return (
        <GlassView
            glassEffectStyle='clear'
            isInteractive={true}
            
        >


        </GlassView>
    );
}



export default function LoginForm() {
    const isDark = useColorScheme() === 'dark';
    if (Platform.OS === 'ios') return <LoginFormIOS />;
    return (
        <View className={`flex-1 px-6`}>

        </View>
    );
}