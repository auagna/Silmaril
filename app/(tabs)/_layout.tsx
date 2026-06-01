import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@/constants/theme";

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
      <Tabs.Screen name="index" options={{ title: "홈", tabBarIcon: ({ color }) => <Icon glyph="⌂" color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: "검색", tabBarIcon: ({ color }) => <Icon glyph="⌕" color={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: "탐험", tabBarIcon: ({ color }) => <Icon glyph="✦" color={color} /> }} />
      <Tabs.Screen name="records" options={{ title: "기록", tabBarIcon: ({ color }) => <Icon glyph="▤" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "프로필", tabBarIcon: ({ color }) => <Icon glyph="◔" color={color} /> }} />
    </Tabs>
  );
}
