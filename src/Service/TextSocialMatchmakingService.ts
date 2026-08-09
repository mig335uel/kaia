import { supabase } from "@/lib/supabase";
import { Profile, UserPreferences } from "@/Types/Users";
import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";
import { Socialmatchmaking } from "@/Types/matchmaking";



class MatchMakingService {



    BuscarChat = async(userPreferencesId: UserPreferences, user: Profile) =>{
        const {data: MatchMakingData, error: MatchMakingError} = await supabase.rpc('find_social_text_matchmaking', {
            p_my_user_id: userPreferencesId.user_id,
            p_min_age: userPreferencesId.min_age_range,
            p_max_age: userPreferencesId.max_age_range,
            p_genderFeed: userPreferencesId.genderFeed
        });
    }
}

export async function suscribeChannel() {
    supabase.channel('public:social_text_matchmaking').on(
        "postgres_changes",
        {
            event: "UPDATE",
            schema: "public",
            table: "social_text_matchmaking",


        },
        (payload) => {
            if (payload.new.matched_with != null) {

                firestore().collection('chats').doc().set({
                    user1: payload.new.user_id,
                    user2: payload.new.matched_with,
                    status: 'active',
                    created_at: firestore.FieldValue.serverTimestamp()
                })
            }

        }
    ).subscribe();

}