import { Octicons } from "@expo/vector-icons";
import { NativeTabs } from "expo-router/build/native-tabs";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
    const { t } = useTranslation();
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index" >
                <NativeTabs.Trigger.Label>{t("home")}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}