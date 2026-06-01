import type { ReactNode } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, space } from "@/constants/theme";

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: insets.top + space.md, paddingBottom: space.xxl };
  if (!scroll) {
    return <View style={[styles.base, pad, { flex: 1 }]}>{children}</View>;
  }
  return (
    <ScrollView style={styles.base} contentContainerStyle={[styles.content, pad]} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space.lg },
});
