export interface Profile{
    id: string;
    name: string;
    last_name: string;
    username: string;
    email?: string;
    gender: "Male" | "Female";
    birth_date: string;
    profile_image: string;
    city: string;
    country: string;
}



export interface UserPreferences{
    user_id: string;
    min_age_range: number;
    max_age_range: number;
    genderFeed: "Male" | "Female" | "All";
}