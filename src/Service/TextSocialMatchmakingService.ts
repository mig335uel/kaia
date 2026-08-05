import { supabase } from "@/lib/supabase";
import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";


export async function suscribeChannel(){
    supabase.channel('public:social_text_matchmaking').on(
        "postgres_changes",
        {
            event: "UPDATE",
            schema: "public",
            table: "social_text_matchmaking",
            
        },
        (payload) => {
            firestore().collection('chats').doc().set({
                user1: payload.new.user_id,
                user2: payload.new.matched_with,
                status: 'active',
                created_at: firestore.FieldValue.serverTimestamp()
            })
                
        }
    ).subscribe();
    
}