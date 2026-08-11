import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppMode } from "@/hooks/useAppMode";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";

export default function DatingIndex() {
    const { setMode } = useAppMode();
    const user = useAuth();
    const isDark = useColorScheme() === 'dark';
    const selectMode = async (selectedMode: 'Social' | 'Dating') => {
        // Cambia la UI instantáneamente vía contexto
        setMode(selectedMode.toLowerCase() as 'dating' | 'social');
        // Actualiza BD (disparará el websocket que tienes en _layout.tsx)
        await supabase.from('users').update({ app_mode: selectedMode }).eq('id', user?.id);
    };

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: isDark ? 'black' : 'white' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: isDark ? 'white': 'black' }}>Dating Mode</Text>
            </View>
        </SafeAreaView>
    );
}
