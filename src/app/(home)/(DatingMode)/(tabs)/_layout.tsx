import { EvilIcons, Foundation, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
    StyleSheet,
    useColorScheme,
    View,
    DeviceEventEmitter,
    LayoutChangeEvent,
} from 'react-native';
import { NativeTabs } from "expo-router/build/native-tabs";
const VISIBLE_TABS = ['index'];
export default function TabLayout() {
    const { t } = useTranslation();

    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>{t("home")}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}