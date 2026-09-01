import { Text, useColorScheme, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useState, useEffect } from "react";
import { InboxAppBar } from "@/Components/appBar/InboxAppBar";
import useAuth from "@/hooks/useAuth";
import { Chat } from "@/Types/Chats";




export default function Inbox() {
    const isDark = useColorScheme() === "dark";
    const user = useAuth();
    const [inbox, setInbox] = useState<Chat[]>([]);
    useEffect(() =>{
        const getInbox = async () =>{
            const snap = await firestore().collection("chats").where("participants", "array-contains", user!.id).get();
            setInbox(snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Chat[]);
        }
    }, [user]);
    return (
        <>
            <InboxAppBar user={user!} />
            <View className={`flex-1 items-center justify-center ${isDark ? 'bg-[#1f2937]' : 'bg-white'}`} >
                
            </View>
        </>
    )
}