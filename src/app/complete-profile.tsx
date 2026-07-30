import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, Image, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

export default function CompleteProfile() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    username: '',
    birth_date: '',
    profile_image: '',
    gender:'',
  });

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    const formatted = currentDate.toISOString().split('T')[0];
    setFormData({ ...formData, birth_date: formatted });
  };

  useEffect(() => {
    // Optionally fetch default info from Google (like name, avatar)
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setFormData((prev) => ({
          ...prev,
          name: data.user.user_metadata?.full_name?.split(' ')[0] || '',
          last_name: data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
          profile_image: data.user.user_metadata?.avatar_url || ''
        }));
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.last_name || !formData.username || !formData.birth_date) {
      Alert.alert(t('error'), t('pleaseFillAllFields'));
      return;
    }

    try {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!data?.user) throw new Error('No user found');

      const ifconfigResponse = await fetch('https://ifconfig.me/all.json');
      const ifconfigData = await ifconfigResponse.json();
      const ipAddress = ifconfigData.ip_addr;
      
      const ipApiResponse = await fetch(`http://ip-api.com/json/${ipAddress}`);
      const locationData = await ipApiResponse.json();
      console.log('Location Data:', locationData);

      const { error } = await supabase.from('users').insert({
        id: data.user.id,
        name: formData.name,
        last_name: formData.last_name,
        username: formData.username,
        birth_date: formData.birth_date,
        profile_image: formData.profile_image || null,
        region: `${locationData.countryCode}, ${locationData.country}`, // e.g. "Quebec, Canada"
      });

      if (error) throw error;
      const birthDate = new Date(formData.birth_date);
      const ageInYears = (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

      let payload ={
        user_id: data.user.id,
        min_age_range: 0,
        max_age_range: 0,
        genderFeed: 'All'
      }

      if(ageInYears < 18){
        payload.max_age_range = 25;
        payload.min_age_range = 18;
      }

      if(ageInYears > 16 && ageInYears < 18){
        payload.max_age_range = 25;
        payload.min_age_range = 16;
      }

      if(ageInYears < 16){
        payload.max_age_range = 16;
        payload.min_age_range = 13;
      }

      const {error: userPreferenceError} = await supabase.from('user_preferences').insert({
          user_id: payload.user_id,
          min_age_range: payload.min_age_range,
          max_age_range: payload.max_age_range,
          genderFeed: payload.genderFeed,
      });
      if (userPreferenceError) throw userPreferenceError;
      // Force a reload of the auth state or navigate manually
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? 'black' : 'white' }}>
      <View className="flex-1 px-6 justify-center">
        <Image source={require('../../assets/Kaia.png')} style={{ width: 100, height: 100, alignSelf: "center" }} resizeMode="contain" />
        <MaskedView
          maskElement={<Text className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-black'}`}>
            {t('completeProfile')}
          </Text>}>
          <LinearGradient
            colors={['#8E2DE2', '#4A00E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text className={`text-3xl font-bold mb-8 text-center opacity-0 ${isDark ? 'text-white' : 'text-black'}`}>
              {t('completeProfile')}
            </Text>
          </LinearGradient>
        </MaskedView>

        <View className="space-y-4 gap-4">
          <TextInput
            className={`w-full p-4 rounded-xl border ${isDark ? 'border-gray-700 text-white' : 'border-gray-300 text-black'}`}
            style={{ backgroundColor: isDark ? '#1a1a1a' : '#f9fafb' }}
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            placeholder={t('firstName')}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <TextInput
            className={`w-full p-4 rounded-xl border ${isDark ? 'border-gray-700 text-white' : 'border-gray-300 text-black'}`}
            style={{ backgroundColor: isDark ? '#1a1a1a' : '#f9fafb' }}
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            placeholder={t('lastName')}
            value={formData.last_name}
            onChangeText={(text) => setFormData({ ...formData, last_name: text })}
          />

          <TextInput
            className={`w-full p-4 rounded-xl border ${isDark ? 'border-gray-700 text-white' : 'border-gray-300 text-black'}`}
            style={{ backgroundColor: isDark ? '#1a1a1a' : '#f9fafb' }}
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            placeholder={t('username')}
            value={formData.username}
            autoCapitalize="none"
            onChangeText={(text) => setFormData({ ...formData, username: text })}
          />

          <View>
            {Platform.OS === 'android' && (
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className={`w-full p-4 rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
                style={{ backgroundColor: isDark ? '#1a1a1a' : '#f9fafb' }}
              >
                <Text className={isDark ? (formData.birth_date ? 'text-white' : 'text-gray-400') : (formData.birth_date ? 'text-black' : 'text-gray-500')}>
                  {formData.birth_date || t('birthDate') + " (YYYY-MM-DD)"}
                </Text>
              </TouchableOpacity>
            )}

            {(showDatePicker || Platform.OS === 'ios') && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View>
            <TouchableOpacity 
              onPress={() => setShowGenderPicker(true)}
              className={`w-full p-4 rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}
              style={{ backgroundColor: isDark ? '#1a1a1a' : '#f9fafb' }}
            >
              <Text className={isDark ? 'text-white' : 'text-black'}>
                {formData.gender ? (formData.gender === 'Male' ? t('male') : t('female')) : t('gender')}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={showGenderPicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowGenderPicker(false)}
            >
              <View className="flex-1 justify-center items-center bg-black/50 px-6">
                <View 
                  className={`w-full rounded-2xl overflow-hidden ${isDark ? 'bg-[#1a1a1a] border border-gray-700' : 'bg-white'}`}
                >
                  <View className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <Text className={`text-xl font-bold text-center ${isDark ? 'text-white' : 'text-black'}`}>
                      {t('gender')}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    className="p-4 border-b border-gray-200 dark:border-gray-800"
                    onPress={() => {
                      setFormData({ ...formData, gender: 'Male' });
                      setShowGenderPicker(false);
                    }}
                  >
                    <Text className={`text-center text-lg ${formData.gender === 'Male' ? 'text-[#8E2DE2] font-bold' : (isDark ? 'text-white' : 'text-black')}`}>
                      {t('male')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="p-4 border-b border-gray-200 dark:border-gray-800"
                    onPress={() => {
                      setFormData({ ...formData, gender: 'Female' });
                      setShowGenderPicker(false);
                    }}
                  >
                    <Text className={`text-center text-lg ${formData.gender === 'Female' ? 'text-[#8E2DE2] font-bold' : (isDark ? 'text-white' : 'text-black')}`}>
                      {t('female')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="p-4 bg-gray-100 dark:bg-gray-900"
                    onPress={() => setShowGenderPicker(false)}
                  >
                    <Text className="text-center text-red-500 font-bold text-lg">
                      {t('cancel', 'Cancel')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <TouchableOpacity onPress={handleSubmit} disabled={loading} className="mt-6">
            <LinearGradient
              colors={['#8E2DE2', '#4A00E0']}
              style={{ paddingVertical: 16, borderRadius: 9999, alignItems: 'center' }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-bold">{t('saveProfile')}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
