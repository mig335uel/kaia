import useAuth from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function TextGame(){
    const user = useAuth();
    useEffect(()=>{
        const createMatchMaking = async() =>{

        }

        createMatchMaking();
    },[user]);




    return (
        <SafeAreaView edges={['top']}>
            
        </SafeAreaView>
    );
}