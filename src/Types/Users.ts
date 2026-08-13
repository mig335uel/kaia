export interface Profile{
    id: string;
    name: string;
    last_name: string;
    username: string;
    description: string;
    gender: "Male" | "Female";
    birth_date: string;
    profile_image: string;
    city?: string;
    country?: string;
    region?: string;
    app_mode?: "Social" | "Dating" | null;
}
export interface SocialUsers{
    id: string;
    username: string;
    description: string;
    gender: "Male" | "Female";
    birth_date: string;
    profile_image: string;
}



export interface UserPreferences{
    id?: string;
    user_id: string;
    min_age_range: number;
    max_age_range: number;
    genderFeed: "Male" | "Female" | "All";
}