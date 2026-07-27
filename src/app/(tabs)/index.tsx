import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignOut } from "@/Service/AuthService";
import { router } from "expo-router";



export default function HomeScreen() {
  const { t } = useTranslation();
  const isDark = useColorScheme() === 'dark';

  const handleSignOut = async () => {
    await SignOut();
    router.replace('/')
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']} className={`${isDark ? 'bg-black' : 'bg-white'}`}>
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
        <TouchableOpacity onPress={() => {handleSignOut()}} className="p-2 bg-red-500 rounded">
          <Text className="text-white">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}