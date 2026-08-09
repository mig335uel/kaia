import { supabase } from "@/lib/supabase";
import { Socialmatchmaking } from "@/Types/matchmaking";
import { UserPreferences } from "@/Types/Users";




export class TextSocialMatchMaking implements Socialmatchmaking {
    user_id: string;
    preferences_id: string;
    created_at: string;
    matched_with?: string;
    
    constructor(userId: string, preferences_id: string) {
        this.user_id = userId;
        this.preferences_id = preferences_id;
        this.created_at = Date.now().toString();
        this.matched_with = undefined;
    }


    TextMatchmaking = async (user_id: string) =>{
        let UserPreferences: UserPreferences;

        const {data, error} = await supabase.from('user_preferences').select('*').eq('user_id', this.user_id).single();

        if(error){
            console.log(error);
            return;
        }

        if(data){
            UserPreferences = data;
        }

        
    }

    

    
}