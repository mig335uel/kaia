import { supabase } from "@/lib/supabase";
import { Profile, UserPreferences } from "@/Types/Users";



function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export class FeedService {
    static async getProfileFeed(user_id: string, limit: number, offset: number) {

        //sacamos las preferencias de los usuarios
        const { data: dataUsersPreferences, error: errorUserPreferences } = await supabase.from('user_preferences').select('*').eq('user_id', user_id).single();
        if (errorUserPreferences) {
            throw errorUserPreferences;
        }

        const userPreferences: UserPreferences = dataUsersPreferences;

        //calculamos el rango de edad

        const min_age = userPreferences.min_age_range;
        const max_age = userPreferences.max_age_range;
        const today = new Date();
        const min_date = new Date(today.getFullYear() - max_age, today.getMonth(), today.getDate()).toISOString();
        const max_date = new Date(today.getFullYear() - min_age, today.getMonth(), today.getDate()).toISOString();

        const genderFeed = userPreferences.genderFeed;

        const rangeStart = offset;
        const rangeEnd = offset + limit - 1;

        switch (genderFeed) {
            case 'All':
                const { data: dataUsers, error: errorUsers } = await supabase.from('users').select('*').gte('birth_date', min_date).lte('birth_date', max_date).range(rangeStart, rangeEnd).neq('id', user_id);
                if (errorUsers) {
                    throw errorUsers;
                }

                const UserFeed: Profile[] = dataUsers;
                return shuffleArray(UserFeed);
            case 'Male':
                const { data: dataUsersMale, error: errorUsersMale } = await supabase.from('users').select('*').gte('birth_date', min_date).lte('birth_date', max_date).eq('gender', 'Male').range(rangeStart, rangeEnd).neq('id', user_id);
                if (errorUsersMale) {
                    throw errorUsersMale;
                }

                const UserFeedMale: Profile[] = dataUsersMale;
                return shuffleArray(UserFeedMale);
            case 'Female':
                const { data: dataUsersFemale, error: errorUsersFemale } = await supabase.from('users').select('*').gte('birth_date', min_date).lte('birth_date', max_date).eq('gender', 'Female').range(rangeStart, rangeEnd).neq('id', user_id);
                if (errorUsersFemale) {
                    throw errorUsersFemale;
                }

                const UserFeedFemale: Profile[] = dataUsersFemale;
                return shuffleArray(UserFeedFemale);
        }
    }
}