import { Chat } from "@/Types/Chats";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, useColorScheme } from "react-native";

export default function ChatScreen({ id }: { id: string }) {
  const isDark = useColorScheme() === "dark";

  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    const getChat = async () => {
      const db = getFirestore();
      const docRef = doc(db, "chats", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setChat({
          id: docSnap.id,
          ...docSnap.data(),
        } as Chat);
      }
    };
    getChat();
  }, [id]);





  return (
    <KeyboardAvoidingView>
    
    
    </KeyboardAvoidingView>
  );
}
