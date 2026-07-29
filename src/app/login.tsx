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
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />


        <MaskedView
          maskElement={<Text className="text-4xl font-bold text-center">{t('welcome')}</Text>}
        >
          <LinearGradient
            colors={['#6A5BFC', '#7575FF', '#3FCECC']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <Text className="text-4xl font-bold text-center opacity-0">{t('welcome')}</Text>
          </LinearGradient>
        </MaskedView>
      </View>
      <View className="w-full  px-6">
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}
