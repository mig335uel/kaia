import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignOut } from "@/Service/AuthService";
import { router } from "expo-router";
import { AppBar } from "@/Components/appBar/AppBar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";



export default function HomeScreen() {
  const { t } = useTranslation();
  const isDark = useColorScheme() === 'dark';

  const [feedPreferencesModalView, setFeedPreferencesModalView] = useState(false);

  const handleSignOut = async () => {
    await SignOut();
    router.replace('/')
  }

  const user = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']} className={`${isDark ? 'bg-black' : 'bg-white'}`}>
      <AppBar isDark={isDark} feedPreferencesModalView={() => setFeedPreferencesModalView(true)}/>
        {feedPreferencesModalView && (
          <FeedPreferencesModal feedPreferencesModalView={feedPreferencesModalView} setFeedPreferencesModalView={setFeedPreferencesModalView}/>
        )}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <MaskedView maskElement={<Text
          className={`${isDark ? 'text-white' : 'text-black'} text-3xl font-bold text-center`}
        >{t('welcome')}</Text>}>
          <LinearGradient
            colors={['#8E2DE2', '#4A00E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text
              className={` text-3xl font-bold text-center opacity-0`}
            >{t('welcome')}</Text>
          </LinearGradient>
        </MaskedView>
        <TouchableOpacity onPress={() => { handleSignOut() }} className="p-2 bg-red-500 rounded">
          <Text className="text-white">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}




function FeedPreferencesModal({feedPreferencesModalView, setFeedPreferencesModalView}: {feedPreferencesModalView: boolean, setFeedPreferencesModalView: (value: boolean) => void}){
  const {t} = useTranslation()
  const isDark = useColorScheme() === 'dark';


  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={feedPreferencesModalView}
      onRequestClose={() => {
        setFeedPreferencesModalView(false);
      }}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={() => setFeedPreferencesModalView(false)} 
        />
        <View style={{ 
          backgroundColor: isDark ? '#1c1c1e' : 'white', 
          borderTopLeftRadius: 25, 
          borderTopRightRadius: 25, 
          padding: 20, 
          alignItems: 'center',
          minHeight: '40%', // Puedes ajustar qué tan alto quieres que sea el modal
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 5,
        }}>
          {/* Pequeña barra superior (indicador de deslizamiento) */}
          <View style={{ width: 40, height: 5, backgroundColor: 'gray', borderRadius: 3, marginBottom: 20 }} />

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: isDark ? 'white' : 'black' }}>
            Preferencias de Feed
          </Text>
          <Text style={{ color: isDark ? 'white' : 'black' }}>
            Aquí irán tus opciones de configuración
          </Text>
          
          <TouchableOpacity
            style={{ marginTop: 30, padding: 15, backgroundColor: '#8E2DE2', borderRadius: 15, width: '100%', alignItems: 'center' }}
            onPress={() => setFeedPreferencesModalView(false)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Guardar y Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
