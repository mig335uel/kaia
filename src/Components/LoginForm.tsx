import { View, Text, Platform, useColorScheme, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { GlassView } from "expo-glass-effect";

function LoginFormIOS({isDark }: { isDark: boolean }) {
    return (
        <GlassView
            glassEffectStyle='clear'
            isInteractive={true}
            className={``}
            
        >
            <TouchableOpacity onPress={()=>{}}>
                <Text></Text>
            </TouchableOpacity>

        </GlassView>
    );
}



export default function LoginForm() {
    const isDark = useColorScheme() === 'dark';
    if (Platform.OS === 'ios') return <LoginFormIOS isDark={isDark} />;
    return (
        <View className={`flex-1 px-6`}>

        </View>
    );
}