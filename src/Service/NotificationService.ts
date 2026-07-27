import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { supabase } from '@/lib/supabase';

export async function requestNotificationPermission(): Promise<string | null> {
  console.log("--- Iniciando requestNotificationPermission ---");

  if (!Device.isDevice) {
    const simToken = `DEV_SIMULATOR_${Device.modelId || 'unknown'}`;
    console.log('Simulador detectado. Token de desarrollo:', simToken);
    return simToken;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync() as any;
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    try {
      const { status } = await Notifications.requestPermissionsAsync() as any;
      finalStatus = status;
    } catch (permError) {
      console.warn("⚠️ Error solicitando permiso:", permError);
    }
  }

  if (finalStatus !== 'granted') {
    console.log("Permiso de notificaciones denegado por el usuario.");
    return null;
  }

  try {
    let token: string | undefined;
    
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        throw new Error("Permisos no concedidos en Firebase Messaging");
      }

      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      
      let retries = 3;
      while (retries > 0) {
        try {
          token = await messaging().getToken();
          if (token) break;
        } catch (e) {
          if (retries === 1) throw e;
          await new Promise(res => setTimeout(res, 1000));
        }
        retries--;
      }
    } else {
      token = await messaging().getToken();
    }
    
    console.log("✅ Token push (FCM) obtenido:", token);
    return token || null;
  } catch (error: any) {
    const devToken = `DEV_${Platform.OS.toUpperCase()}_${Device.osBuildId || Device.modelId || Date.now()}`;
    console.warn("⚠️ Token push no disponible. Usando token de desarrollo:", devToken, error.message);
    return devToken;
  }
}

export async function saveDeviceToken(userId: string, token: string) {
  try {
    let myDeviceIdentifier = await SecureStore.getItemAsync('kaia_device_identifier');
    if (!myDeviceIdentifier) {
      myDeviceIdentifier = `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      await SecureStore.setItemAsync('kaia_device_identifier', myDeviceIdentifier);
    }

    // Limpieza previa
    await supabase
      .from('devices')
      .delete()
      .or(`fcm_token.eq."${token}",and(user_id.eq."${userId}",device_identifier.eq."${myDeviceIdentifier}")`);

    const deviceName = Device.modelName || 'Unknown Device';
    
    const { data: deviceRow, error } = await supabase
      .from('devices')
      .insert({
        user_id: userId,
        device_identifier: myDeviceIdentifier,
        device_name: deviceName,
        platform: Platform.OS,
        fcm_token: token,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error insertando dispositivo en BD:', error.message);
      return;
    }

    if (deviceRow?.id) {
      await SecureStore.setItemAsync('kaia_device_db_id', deviceRow.id);
      console.log('✅ Dispositivo registrado en la BD:', deviceRow.id);
    }

  } catch (err) {
    console.error('❌ Error en saveDeviceToken:', err);
  }
}

export async function removeDeviceToken() {
  try {
    const deviceDbId = await SecureStore.getItemAsync('kaia_device_db_id');
    if (deviceDbId) {
      await supabase.from('devices').delete().eq('id', deviceDbId);
      await SecureStore.deleteItemAsync('kaia_device_db_id');
      console.log('✅ Dispositivo desregistrado de la BD');
    }
  } catch (err) {
    console.error('❌ Error en removeDeviceToken:', err);
  }
}
