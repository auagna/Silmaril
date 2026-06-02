import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@/constants/theme";

// IA v2 (D-017): Map 중심 4탭. 지도(Map) / 보관(Archive) / 만들기(Create) / 나(My View).
function Icon({ glyph, color }: { glyph: string; color: string }) {
  return <Text style={{ fontSize: 18, color }}>{glyph}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink900,
        tabBarInactiveTintColor: colors.ink400,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
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
