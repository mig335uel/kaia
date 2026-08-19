import { Text, useColorScheme, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useState, useEffect } from "react";




export default function Inbox() {
    const isDark = useColorScheme() === "dark";
    return (
        <View className={`flex-1 items-center justify-center ${isDark ? 'bg-[#1f2937]' : 'bg-white'}`} >
            <Text>Inbox</Text>
        </View>
    )
}