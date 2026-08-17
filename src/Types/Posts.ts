import { Profile } from "./Users";

export interface Posts{
    id?: string;
    user: Profile;
    content: string;
    media_feature: MediaFeature[];
    create_at: Date;
    likes_count: number;
    comments_count: number;
    share_count: number;
    views_count: number;
}

export interface MediaFeature{
    id?: string;
    post_id: string;
    type_media: string;    
    media_url: string;
}