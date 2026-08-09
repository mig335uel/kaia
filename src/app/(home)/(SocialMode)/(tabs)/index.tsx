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
import { ProfileFeed } from "@/Components/ProfilesFeed/ProfileFeed";
import { useAppMode } from "@/hooks/useAppMode";




export default function HomeScreen() {
  const { t } = useTranslation();
  const isDark = useColorScheme() === 'dark';

  const [feedPreferencesModalView, setFeedPreferencesModalView] = useState(false);
  const [showModePicker, setShowModePicker] = useState(false);
  const { setMode } = useAppMode();

  const handleSignOut = async () => {
    await SignOut();
  }
  const user = useAuth();

  const [currentUserPreferences, setCurrentUserPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    const checkAppMode = async () => {
      if (!user || !user.id) return;

      if (!user.app_mode) {
        const bDate = new Date(user.birth_date);
        const age = Math.floor((Date.now() - bDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        if (age >= 18) {
          setShowModePicker(true);
        } else {
          // Si es menor de 18, le asignamos Social y la UI se actualiza sola
          await supabase.from('users').update({ app_mode: 'Social' }).eq('id', user.id);
        }
      }
    };
    checkAppMode();
  }, [user]);

  const selectMode = async (selectedMode: 'Social' | 'Dating') => {
    setShowModePicker(false);

    // Al actualizar el contexto local, el (home)/_layout cambia instantaneamente
    setMode(selectedMode.toLowerCase() as 'dating' | 'social');

    // Y actualizamos supabase en segundo plano
    await supabase.from('users').update({ app_mode: selectedMode }).eq('id', user?.id);
  };

  useEffect(() => {
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
  }, [user])

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
      <AppBar isDark={isDark} feedPreferencesModalView={() => setFeedPreferencesModalView(true)} />
      {feedPreferencesModalView && (
        <FeedPreferencesModal
          feedPreferencesModalView={feedPreferencesModalView}
          setFeedPreferencesModalView={setFeedPreferencesModalView}
          user={user}
          preferences={changeUserPreference}
          setPreferences={setChangeUserPreference}
        />
      )}
      <View style={{ marginTop: 20 }} />
      <Cards />
      <View style={{ marginBottom: 15 }} />
      <ProfileFeed isDark={isDark} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={handleSignOut}>
          <View className="bg-white dark:bg-red-500 rounded-full p-3">
            <Text className="text-white font-bold">{t("logout")}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => { }}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className={`w-full p-6 rounded-t-3xl ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <Text className={`text-2xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-black'}`}>
              {t('chooseMode', 'Elige tu experiencia')}
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              {t('chooseModeDesc', 'Puedes cambiar de modo en cualquier momento desde los ajustes')}
            </Text>

            <TouchableOpacity
              onPress={() => selectMode('Dating')}
              className="mb-4 shadow-sm"
            >
              <LinearGradient
                colors={['#FF655B', '#FF5864']}
                className="p-5 rounded-2xl flex-row items-center justify-between"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View className="flex-row items-center gap-4">
                  <View className="bg-white/20 p-3 rounded-full">
                    <Ionicons name="heart" size={24} color="white" />
                  </View>
                  <View>
                    <Text className="text-white text-xl font-bold">Kaia Dating</Text>
                    <Text className="text-white/80 font-medium">Conoce gente nueva y ten citas</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => selectMode('Social')}
              className="mb-6 shadow-sm"
            >
              <LinearGradient
                colors={['#8E2DE2', '#4A00E0']}
                className="p-5 rounded-2xl flex-row items-center justify-between"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View className="flex-row items-center gap-4">
                  <View className="bg-white/20 p-3 rounded-full">
                    <Ionicons name="chatbubbles" size={24} color="white" />
                  </View>
                  <View>
                    <Text className="text-white text-xl font-bold">Kaia Social</Text>
                    <Text className="text-white/80 font-medium">Chatea, haz amigos y comparte</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
}) {
  const { t } = useTranslation()
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
            <TouchableOpacity onPress={() => setPreferences({ ...preferences, genderFeed: 'Male' })}>
              <View className={`flex flex-col items-center justify-center rounded-xl h-24 w-24 ${preferences.genderFeed === 'Male' ? (isDark ? 'bg-blue-900 border-2 border-[#0085FF]' : 'bg-[#87C8FF] border-2 border-blue-500') : (isDark ? 'bg-gray-800' : 'bg-gray-200')}`}>
                <Ionicons name='male' size={48} color={preferences.genderFeed === 'Male' ? '#0085FF' : 'gray'} />
                <Text style={{ color: preferences.genderFeed === 'Male' ? '#0085FF' : 'gray', fontWeight: 'bold', marginTop: 5 }}>{t('boy')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPreferences({ ...preferences, genderFeed: 'Female' })}>
              <View className={`flex flex-col items-center justify-center rounded-xl h-24 w-24 ${preferences.genderFeed === 'Female' ? (isDark ? 'bg-pink-900 border-2 border-[#FF0085]' : 'bg-[#FF87C8] border-2 border-pink-500') : (isDark ? 'bg-gray-800' : 'bg-gray-200')}`}>
                <Ionicons name='female' size={48} color={preferences.genderFeed === 'Female' ? '#FF0085' : 'gray'} />
                <Text style={{ color: preferences.genderFeed === 'Female' ? '#FF0085' : 'gray', fontWeight: 'bold', marginTop: 5 }}>{t('girl')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPreferences({ ...preferences, genderFeed: 'All' })}>
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
