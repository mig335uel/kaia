import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, Image } from 'react-native';
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
  const [date, setDate] = useState(new Date());

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    username: '',
    birth_date: '',
    profile_image: ''
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

      const { error } = await supabase.from('users').insert({
        id: data.user.id,
        name: formData.name,
        last_name: formData.last_name,
        username: formData.username,
        birth_date: formData.birth_date,
        profile_image: formData.profile_image || null,
      });

      if (error) throw error;

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
