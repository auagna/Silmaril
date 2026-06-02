import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useTheme } from "@/theme";

// IA v2 (D-017): Map 중심 4탭. 지도/보관/만들기/나. 탭바도 Day/Night 테마 적용.
function Icon({ glyph, color }: { glyph: string; color: string }) {
  return <Text style={{ fontSize: 18, color }}>{glyph}</Text>;
}

export default function TabsLayout() {
  const c = useTheme().colors;
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
      <Tabs.Screen name="index" options={{ title: "지도", tabBarIcon: ({ color }) => <Icon glyph="✦" color={color} /> }} />
      <Tabs.Screen name="archive" options={{ title: "보관", tabBarIcon: ({ color }) => <Icon glyph="▤" color={color} /> }} />
      <Tabs.Screen name="create" options={{ title: "만들기", tabBarIcon: ({ color }) => <Icon glyph="＋" color={color} /> }} />
      <Tabs.Screen name="my-view" options={{ title: "나", tabBarIcon: ({ color }) => <Icon glyph="◔" color={color} /> }} />
    </Tabs>
  );
}
