import { TextInput, View } from "react-native";


interface Props{
    content: string;
    setContent: (content: string) => void;
}




export default function KaiaPostsTextEditor({
    content,
    setContent
}: Props) {
    return (
        <View>
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Escribe tu publicación"
                placeholderTextColor="#9ca3af"
                multiline
                style={{ minHeight: 120 }}
                className="w-full text-black dark:text-white"
            />
        </View>
    );
}