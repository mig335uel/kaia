import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import es from '@/i18n/translations/es.json';
import en from '@/i18n/translations/en.json';

const resources = {
  es: { translation: es },
  en: { translation: en },
};

// Obtenemos el idioma del dispositivo o usamos 'es' por defecto
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    const languageCode = locales[0].languageCode;
    return languageCode || 'es';
  }
  return 'es';
};

i18n
  .use(initReactI18next) // pases i18n instance to react-i18next.
  .init({
    resources,
    lng: getDeviceLanguage(), // idioma inicial
    fallbackLng: 'es',        // idioma de reserva si la traducción no existe

    interpolation: {
      escapeValue: false, // react ya protege contra XSS de forma predeterminada
    },
    compatibilityJSON: 'v4', // Recomendado para React Native
  });

export default i18n;
