import { Image, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import LoginForm from '@Components/LoginForm';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';




export default function Index() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? 'black' : 'white', justifyContent: 'center' }}>
      <View className="items-center mb-8">
        <Image
          source={require('../../assets/Kaia.png')}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
      

        <MaskedView
          maskElement={<Text className="text-3xl font-bold text-center">{t('welcome')}</Text>}
        >
          <LinearGradient
            colors={['#8E2DE2', '#4A00E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text className="text-3xl font-bold text-center opacity-0">{t('welcome')}</Text>
          </LinearGradient>
        </MaskedView>
      </View>
      <View className="w-full  px-6">
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}
