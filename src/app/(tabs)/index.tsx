import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, useColorScheme, View, Dimensions } from "react-native";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { SafeAreaView } from "react-native-safe-area-context";
import { SignOut } from "@/Service/AuthService";
import { router } from "expo-router";
import { AppBar } from "@/Components/appBar/AppBar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";
import { UserPreferences } from "@/Types/Users";
import { Ionicons } from "@expo/vector-icons";
import { Cards } from "@/Components/CardsGames/Cards";



export default function HomeScreen() {
  const { t } = useTranslation();
  const isDark = useColorScheme() === 'dark';

  const [feedPreferencesModalView, setFeedPreferencesModalView] = useState(false);

  const handleSignOut = async () => {
    await SignOut();
  }
  const user = useAuth();

  const [currentUserPreferences, setCurrentUserPreferences] = useState<UserPreferences | null>(null);

  useEffect(()=>{
    const getCurrentUserPreferences = async () => {
      if (!user || !user.id) return;

      const { data, error } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).single();
      if (error) {
        console.error('Error fetching user preferences:', error);
        return;
      }
      console.log(data)
      setCurrentUserPreferences(data);
    }
    getCurrentUserPreferences();
  },[user])

  const [changeUserPreference, setChangeUserPreference] = useState<UserPreferences>({
    user_id: user?.id || "",
    min_age_range: currentUserPreferences?.min_age_range || 18,
    max_age_range: currentUserPreferences?.max_age_range || 99,
    genderFeed: currentUserPreferences?.genderFeed || "All",
  });

  useEffect(() => {
    if (currentUserPreferences) {
      setChangeUserPreference({
        user_id: user?.id || "",
        min_age_range: currentUserPreferences.min_age_range || 18,
        max_age_range: currentUserPreferences.max_age_range || 99,
        genderFeed: currentUserPreferences.genderFeed || "All",
      });
    }
  }, [currentUserPreferences, user]);




  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']} className={`${isDark ? 'bg-black' : 'bg-white'}`}>
      <AppBar isDark={isDark} feedPreferencesModalView={() => setFeedPreferencesModalView(true)}/>
        {feedPreferencesModalView && (
          <FeedPreferencesModal 
            feedPreferencesModalView={feedPreferencesModalView} 
            setFeedPreferencesModalView={setFeedPreferencesModalView}
            user={user}
            preferences={changeUserPreference}
            setPreferences={setChangeUserPreference}
          />
        )}

        <Cards/>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <MaskedView maskElement={<Text
          className={`${isDark ? 'text-white' : 'text-black'} text-3xl font-bold text-center`}
        >{t('welcome')}</Text>}>
          <LinearGradient
            colors={['#6A5BFC', '#7575FF', '#3FCECC']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <Text
              className={` text-3xl font-bold text-center opacity-0`}
            >{t('welcome')}</Text>
          </LinearGradient>
        </MaskedView>
        <TouchableOpacity onPress={() => { handleSignOut() }} className="p-2 bg-red-500 rounded mt-4">
          <Text className="text-white">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}




function FeedPreferencesModal({
  feedPreferencesModalView, 
  setFeedPreferencesModalView,
  user,
  preferences,
  setPreferences
}: {
  feedPreferencesModalView: boolean, 
  setFeedPreferencesModalView: (value: boolean) => void,
  user: any,
  preferences: UserPreferences,
  setPreferences: (prefs: UserPreferences) => void
}){
  const {t} = useTranslation()
  const isDark = useColorScheme() === 'dark';

  const birthDate = user?.birth_date ? new Date(user.birth_date) : null;
  const userAge = birthDate ? Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 18;
  const isUnder16 = userAge < 16;

  const screenWidth = Dimensions.get('window').width;

  const handleSliderChange = (values: number[]) => {
    if (isUnder16) return;
    setPreferences({
      ...preferences,
      min_age_range: values[0],
      max_age_range: values[1],
    });
  };


  const handleSubmit = async () => {

    const { error } = await supabase.from('user_preferences').update(preferences).eq('user_id', user.id);
    if (error) {
      console.error('Error updating user preferences:', error);
      return;
    }
    console.log("user preferences updated")
    setFeedPreferencesModalView(false);
  }
  
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
          minHeight: '40%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 5,
        }}>
          <View style={{ width: 40, height: 5, backgroundColor: 'gray', borderRadius: 3, marginBottom: 20 }} />
          
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: isDark ? 'white' : 'black' }}>
            Preferencias de Feed
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30, paddingHorizontal: 10 }}>
            <TouchableOpacity onPress={() => setPreferences({...preferences, genderFeed: 'Male'})}>
              <View className={`flex flex-col items-center justify-center rounded-xl h-24 w-24 ${preferences.genderFeed === 'Male' ? (isDark ? 'bg-blue-900 border-2 border-[#0085FF]' : 'bg-[#87C8FF] border-2 border-blue-500') : (isDark ? 'bg-gray-800' : 'bg-gray-200')}`}>
                <Ionicons name='male' size={48} color={preferences.genderFeed === 'Male' ? '#0085FF' : 'gray'} />
                <Text style={{ color: preferences.genderFeed === 'Male' ? '#0085FF' : 'gray', fontWeight: 'bold', marginTop: 5 }}>{t('boy')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPreferences({...preferences, genderFeed: 'Female'})}>
              <View className={`flex flex-col items-center justify-center rounded-xl h-24 w-24 ${preferences.genderFeed === 'Female' ? (isDark ? 'bg-pink-900 border-2 border-[#FF0085]' : 'bg-[#FF87C8] border-2 border-pink-500') : (isDark ? 'bg-gray-800' : 'bg-gray-200')}`}>
                <Ionicons name='female' size={48} color={preferences.genderFeed === 'Female' ? '#FF0085' : 'gray'} />
                <Text style={{ color: preferences.genderFeed === 'Female' ? '#FF0085' : 'gray', fontWeight: 'bold', marginTop: 5 }}>{t('girl')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPreferences({...preferences, genderFeed: 'All'})}>
              <View className={`flex flex-col items-center justify-center rounded-xl h-24 w-24 ${preferences.genderFeed === 'All' ? (isDark ? 'bg-purple-900 border-2 border-[#8E2DE2]' : 'bg-[#D0B3F2] border-2 border-purple-500') : (isDark ? 'bg-gray-800' : 'bg-gray-200')}`}>
                <Ionicons name='male-female' size={48} color={preferences.genderFeed === 'All' ? '#8E2DE2' : 'gray'} />
                <Text style={{ color: preferences.genderFeed === 'All' ? '#8E2DE2' : 'gray', fontWeight: 'bold', marginTop: 5 }}>{t('all', 'Todos')}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? 'white' : 'black', marginBottom: 15, alignSelf: 'flex-start', marginLeft: 10 }}>
              Rango de Edad {isUnder16 && "(Fijo por ser menor de 16 años)"}
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10, paddingHorizontal: 15 }}>
              <Text style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold', fontSize: 16 }}>
                {isUnder16 ? 13 : preferences.min_age_range} años
              </Text>
              <Text style={{ color: isDark ? 'white' : 'black', fontWeight: 'bold', fontSize: 16 }}>
                {isUnder16 ? 16 : preferences.max_age_range} años
              </Text>
            </View>

            <MultiSlider
              values={isUnder16 ? [13, 16] : [preferences.min_age_range, preferences.max_age_range]}
              sliderLength={screenWidth - 80}
              onValuesChange={handleSliderChange}
              min={18}
              max={99}
              step={1}
              allowOverlap={false}
              snapped
              minMarkerOverlapDistance={1}
              customMarker={() => (
                <View style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  backgroundColor: '#8E2DE2',
                  borderWidth: 2,
                  borderColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 2,
                  elevation: 4
                }} />
              )}
              selectedStyle={{
                backgroundColor: '#8E2DE2',
                height: 4,
              }}
              unselectedStyle={{
                backgroundColor: isDark ? '#333' : '#ddd',
                height: 4,
              }}
              containerStyle={{
                height: 40,
              }}
              trackStyle={{
                height: 4,
                borderRadius: 2,
              }}
              enabledOne={!isUnder16}
              enabledTwo={!isUnder16}
            />
          </View>
          
          <TouchableOpacity
            style={{ marginTop: 30, padding: 15, backgroundColor: '#8E2DE2', borderRadius: 15, width: '100%', alignItems: 'center' }}
            onPress={handleSubmit}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Guardar y Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
