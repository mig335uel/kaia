import { KeyboardAvoidingView, TextInput, View } from "react-native";


interface Props{
    content: string;
    setContent: (content: string) => void;
}




export default function KaiaPostsTextEditor({
    content,
    setContent
}: Props) {
    return (
        <View className="flex-1 w-full mt-2">
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="¿Qué tienes en mente?"
                placeholderTextColor="#9ca3af"
                multiline
                autoFocus={true}
                textAlignVertical="top"
                style={{ fontSize: 20, minHeight: 200 }}
                className="flex-1 w-full text-black dark:text-white"
            />
        </View>
    );
}