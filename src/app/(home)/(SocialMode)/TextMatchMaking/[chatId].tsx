import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";





export default function ChatRoom(){
    return(
        <SafeAreaView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}