import useAuth from "@/hooks/useAuth";
import { FeedService } from "@/Service/FeedService";
import { Profile } from "@/Types/Users";
import { GlassView } from "expo-glass-effect";
import { useEffect, useState } from "react";
import { FlatList, Image, Platform, StyleSheet, Text, useColorScheme, View } from "react-native";




export function ProfileFeed({ isDark }: { isDark: boolean }) {
    const users = useAuth();
    const [userFeed, setUserFeed] = useState<Profile[]>([]);


    useEffect(() => {
        const getUser = async () => {
            if (!users?.id) return;
            const dataUserFeed = await FeedService.getProfileFeed(users.id)
            setUserFeed(dataUserFeed);
        }
        getUser();
    }, [users?.id]);




    return (
        <FlatList
            data={userFeed}
            renderItem={({ item }) => profileCard({ profile: item, isDark })}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            className="w-full pt-2"
        />
    );
}




const profileCard = ({ profile, isDark }: { profile: Profile, isDark: boolean }) => {
   
        return (
            <View className={`flex flex-row items-center p-4 mb-3 mx-4 rounded-2xl ${isDark ? 'bg-[#1f2937] border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm`}>
                <Image
                    source={{ uri: profile.profile_image ? profile.profile_image : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                    className="w-16 h-16 rounded-full bg-gray-200"
                />
                <View className="ml-4 flex-1">
                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        @{profile.username}
                    </Text>
                    {profile.description ? (
                        <Text className={`text-sm mt-1 leading-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} numberOfLines={2}>
                            {profile.description}
                        </Text>
                    ) : null}
                </View>
            </View>
        );
    
}




const styles = StyleSheet.create({

});