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