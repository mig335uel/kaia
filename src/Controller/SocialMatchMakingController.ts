import { supabase } from "@/lib/supabase";
import { Socialmatchmaking } from "@/Types/matchmaking";




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

    

    
}