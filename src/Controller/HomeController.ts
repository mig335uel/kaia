import { useState, useCallback, useEffect } from 'react';
import { Profile } from "@/Types/Users";
import { FeedService } from "@/Service/FeedService";

export function useHomeController(userId: string | undefined) {
    const [userFeed, setUserFeed] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;

    const loadProfiles = useCallback(async (currentOffset: number, isRefresh = false) => {
        if (!userId || (loading && !isRefresh) || (!hasMore && !isRefresh)) return;
        
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const data = await FeedService.getProfileFeed(userId, limit, currentOffset);
            
            // Supabase returns an empty array if out of bounds, or fewer elements than limit
            if (data.length < limit) {
                setHasMore(false);
            }
            
            if (isRefresh) {
                setUserFeed(data);
            } else {
                setUserFeed(prev => [...prev, ...data]);
            }
            
            setOffset(currentOffset + limit);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId, loading, hasMore]);

    useEffect(() => {
        if (userId) {
            setHasMore(true);
            loadProfiles(0, true);
        }
    }, [userId]);

    const loadMore = () => {
        if (!loading && !refreshing && hasMore) {
            loadProfiles(offset);
        }
    };

    const refresh = () => {
        setHasMore(true);
        loadProfiles(0, true);
    };

    return {
        userFeed,
        loading,
        refreshing,
        loadMore,
        refresh
    };
}