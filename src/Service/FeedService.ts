import { supabase } from "@/lib/supabase";
import { Profile, UserPreferences } from "@/Types/Users";



export class FeedService {
    static async getProfileFeed(user_id: string) {

        //sacamos las preferencias de los usuarios
        const { data: dataUsersPreferences, error: errorUserPreferences } = await supabase.from('user_preferences').select('*').eq('user_id', user_id).single();
        if (errorUserPreferences) {
            throw errorUserPreferences;
        }
        console.log(dataUsersPreferences);

        const userPreferences: UserPreferences = dataUsersPreferences;

        //calculamos el rango de edad

        const min_age = userPreferences.min_age_range;
        const max_age = userPreferences.max_age_range;
        const today = new Date();
        const min_date = new Date(today.getFullYear() - max_age, today.getMonth(), today.getDate()).toISOString();
        const max_date = new Date(today.getFullYear() - min_age, today.getMonth(), today.getDate()).toISOString();

        const genderFeed = userPreferences.genderFeed;

        switch (genderFeed) {
            case 'All':
                const { data: dataUsers, error: errorUsers } = await supabase.from('users').select('*').gte('birth_date', min_date).lte('birth_date', max_date);
                if (errorUsers) {
                    throw errorUsers;
                }

                const UserFeed: Profile[] = dataUsers;
                return UserFeed;
            case 'Male':
                const { data: dataUsersMale, error: errorUsersMale } = await supabase.from('users').select('*').gte('birth_date', min_date).lte('birth_date', max_date).eq('gender', 'Male');
                if (errorUsersMale) {
                    throw errorUsersMale;
                }

                const UserFeedMale: Profile[] = dataUsersMale;
                return UserFeedMale;
            case 'Female':
                const { data: dataUsersFemale, error: errorUsersFemale } = await supabase.from('users').select('*').gte('birth_date', min_date).lte('birth_date', max_date).eq('gender', 'Female');
                if (errorUsersFemale) {
                    throw errorUsersFemale;
                }

                const UserFeedFemale: Profile[] = dataUsersFemale;
                return UserFeedFemale;
        }
    }
}