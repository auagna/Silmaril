import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useTheme } from "@/theme";
import { useLocale } from "@/i18n";

// IA v2 (D-017): Map 중심 4탭. 탭바 Day/Night + ko/en.
function Icon({ glyph, color }: { glyph: string; color: string }) {
  return <Text style={{ fontSize: 18, color }}>{glyph}</Text>;
}

export default function TabsLayout() {
  const c = useTheme().colors;
  const { t } = useLocale();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.textMain,
        tabBarInactiveTintColor: c.textMuted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.lineDefault },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("map"), tabBarIcon: ({ color }) => <Icon glyph="✦" color={color} /> }} />
      <Tabs.Screen name="archive" options={{ title: t("archive"), tabBarIcon: ({ color }) => <Icon glyph="▤" color={color} /> }} />
      <Tabs.Screen name="create" options={{ title: t("create"), tabBarIcon: ({ color }) => <Icon glyph="＋" color={color} /> }} />
      <Tabs.Screen name="my-view" options={{ title: t("myView"), tabBarIcon: ({ color }) => <Icon glyph="◔" color={color} /> }} />
    </Tabs>
  );
}
