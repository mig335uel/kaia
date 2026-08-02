import useAuth from "@/hooks/useAuth";
import { useHomeController } from "@/Controller/HomeController";
import { Profile } from "@/Types/Users";
import { GlassView } from "expo-glass-effect";
import { useEffect, useState } from "react";
import { FlatList, Image, Platform, StyleSheet, Text, useColorScheme, View, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function ProfileFeed({ isDark }: { isDark: boolean }) {
    const users = useAuth();
    const { userFeed, loading, refreshing, loadMore, refresh } = useHomeController(users?.id);

    return (
        <FlatList
            data={userFeed}
            renderItem={({ item }) => <ProfileCard profile={item} isDark={isDark} />}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={isDark ? "white" : "black"} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            className="w-full pt-2"
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading ? <ActivityIndicator size="large" color={isDark ? "white" : "black"} style={{ marginVertical: 20 }} /> : null}
        />
    );
}




const ProfileCard = ({ profile, isDark }: { profile: Profile, isDark: boolean }) => {


    const [CalculateAge, setCalculateAge] = useState(0);

    useEffect(() => {
        if (profile.birth_date) {
            const age = new Date().getFullYear() - new Date(profile.birth_date).getFullYear();
            setCalculateAge(age);
        }
    }, [profile.birth_date]);

    return (
        <TouchableOpacity>

            <View className={`flex flex-row items-center p-4 mb-3 mx-4 rounded-2xl ${isDark ? 'bg-[#1f2937] border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm`}>
                <Image
                    source={{ uri: profile.profile_image ? profile.profile_image : 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
                    className="w-16 h-16 rounded-full bg-gray-200"
                />
                <View className="ml-4 flex-1">
                    <View className="flex flex-row items-center gap-1">

                        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            @{profile.username}
                        </Text>
                        <View className={`flex flex-row items-center ${profile.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'} px-[4px] py-[1.75px] gap-[1px] rounded-2xl`}>

                            <Ionicons name={`${profile.gender === 'Male' ? 'male' : 'female'}`} color={isDark ? "white" : "black"} size={14} />
                            <Text className={`text-sm mt-1 leading-5 text-white`}>{CalculateAge}</Text>
                        </View>
                    </View>
                    {profile.description ? (
                        <Text className={`text-sm mt-1 leading-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} numberOfLines={2}>
                            {profile.description}
                        </Text>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );

}




const styles = StyleSheet.create({

});